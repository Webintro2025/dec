import { NextResponse } from 'next/server';
import prisma from '../../utils/prisma';

// Safely read and parse JSON body. Returns an object or an error marker.
async function readJsonSafe(request) {
  try {
    // Use text() to allow detecting empty bodies
    const text = await request.text();
    if (!text) return {};
    try {
      return JSON.parse(text);
    } catch (err) {
      return { __jsonError: true, message: 'Invalid JSON payload' };
    }
  } catch (err) {
    return { __jsonError: true, message: 'Unable to read request body' };
  }
}

function serializeCart(cartDoc) {
  if (!cartDoc) {
    return { userId: '', items: [], total: 0 };
  }

  const normalizedItems = [];

  (cartDoc.items || []).forEach((item) => {
  const productDoc = item.product && typeof item.product === 'object' ? item.product : null;
  // prefer Prisma product.id, fall back to legacy Mongo _id or raw id value
  const productId = productDoc?.id ? String(productDoc.id) : (productDoc?._id ? String(productDoc._id) : String(item.product));
    const unitPrice = typeof item.price === 'number' ? item.price : Number(item.price) || Number(productDoc?.price) || 0;
    const stockValue = typeof productDoc?.quantity === 'number' && Number.isFinite(productDoc.quantity)
      ? Math.max(0, productDoc.quantity)
      : null;
    const effectiveQuantity = stockValue !== null ? Math.min(item.quantity, stockValue) : item.quantity;

    if (effectiveQuantity <= 0) {
      return;
    }

    normalizedItems.push({
      productId,
      name: item.name || productDoc?.name || 'Product',
      price: unitPrice,
      quantity: effectiveQuantity,
      image: Array.isArray(productDoc?.images) && productDoc.images.length > 0 ? productDoc.images[0] : null,
      maxQuantity: stockValue,
    });
  });

  const total = normalizedItems.reduce((sum, entry) => sum + entry.price * entry.quantity, 0);

  return {
    userId: cartDoc.userId,
    items: normalizedItems,
    total,
  };
}

function toNumber(value) {
  if (value === null || value === undefined) return undefined;
  if (typeof value === 'number') return Number.isFinite(value) ? value : NaN;
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) return undefined;
    const num = Number(trimmed);
    return Number.isNaN(num) ? NaN : num;
  }
  return NaN;
}

async function getOrCreateCart(userId) {
  // Try to find existing cart first
  let cart = await prisma.cart.findUnique({ where: { userId } });
  if (cart) return cart;

  // Ensure a corresponding user row exists. In the app we allow guest userIds
  // (like 'guest_xxx'). The Cart.userId is a foreign key to User.id, and the
  // User.email field is required at the schema level. To support guest carts
  // without forcing a full sign-up flow, create a lightweight placeholder
  // user record when the id is missing. The guest email uses the userId to
  // guarantee uniqueness.
  let user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    const safeLocalPart = String(userId).replace(/[^a-zA-Z0-9._-]/g, '_');
    const guestEmail = `${safeLocalPart}@guest.local`;
    try {
      user = await prisma.user.create({ data: { id: userId, email: guestEmail, isVerified: false } });
    } catch (err) {
      // In rare cases the guest email may collide with an existing user.
      // Fallback: create with a random uuid id and then create the cart
      // pointing to the requested userId will still fail; so instead try to
      // recover by finding any user with that guestEmail, or throw upward.
      user = await prisma.user.findUnique({ where: { email: guestEmail } });
      if (!user) throw err;
    }
  }

  // Now create the cart for that userId (should succeed because user exists)
  cart = await prisma.cart.create({ data: { userId } });
  return cart;
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId || !userId.trim()) {
    return NextResponse.json({ message: 'userId query parameter is required' }, { status: 400 });
  }

  const cart = await prisma.cart.findUnique({
    where: { userId: userId.trim() },
    include: { items: { include: { product: true } } },
  });

  if (!cart) {
    return NextResponse.json({ cart: { userId: userId.trim(), items: [], total: 0 } });
  }

  return NextResponse.json({ cart: serializeCart(cart) });
}

export async function POST(request) {
  const body = await readJsonSafe(request);
  if (body && body.__jsonError) {
    return NextResponse.json({ message: body.message }, { status: 400 });
  }
  const userId = body?.userId?.trim();
  const productId = body?.productId?.trim();
  const quantityNum = toNumber(body?.quantity) ?? 1;

  if (!userId) {
    return NextResponse.json({ message: 'userId is required' }, { status: 400 });
  }
  if (!productId) {
    return NextResponse.json({ message: 'productId is required' }, { status: 400 });
  }
  if (Number.isNaN(quantityNum) || quantityNum < 1) {
    return NextResponse.json({ message: 'quantity must be a positive number' }, { status: 400 });
  }

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) {
    return NextResponse.json({ message: 'Invalid product specified' }, { status: 400 });
  }

  const availableStock = typeof product.quantity === 'number' && Number.isFinite(product.quantity)
    ? Math.max(0, product.quantity)
    : null;

  if (availableStock !== null && availableStock <= 0) {
    return NextResponse.json({ message: 'Product is out of stock' }, { status: 409 });
  }

  const cart = await getOrCreateCart(userId);

  // find existing cart item
  const existingItem = await prisma.cartItem.findFirst({ where: { cartId: cart.id, productId } });

  const currentQuantity = existingItem ? existingItem.quantity : 0;
  const desiredQuantity = currentQuantity + quantityNum;
  const finalQuantity = availableStock !== null ? Math.min(desiredQuantity, availableStock) : desiredQuantity;

  if (finalQuantity <= 0) {
    return NextResponse.json({ message: 'Product is out of stock' }, { status: 409 });
  }

  if (existingItem) {
    await prisma.cartItem.update({ where: { id: existingItem.id }, data: { quantity: finalQuantity } });
  } else {
    await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: finalQuantity,
      },
    });
  }

  const updatedCart = await prisma.cart.findUnique({ where: { id: cart.id }, include: { items: { include: { product: true } } } });

  return NextResponse.json({ message: 'Product added to cart', cart: serializeCart(updatedCart) }, { status: 201 });
}

export async function PATCH(request) {
  const body = await readJsonSafe(request);
  if (body && body.__jsonError) {
    return NextResponse.json({ message: body.message }, { status: 400 });
  }
  const userId = body?.userId?.trim();
  const productId = body?.productId?.trim();
  const action = body?.action;
  const quantityValue = body?.quantity;

  if (!userId) {
    return NextResponse.json({ message: 'userId is required' }, { status: 400 });
  }
  if (!productId) {
    return NextResponse.json({ message: 'productId is required' }, { status: 400 });
  }

  const cart = await prisma.cart.findUnique({ where: { userId } });
  if (!cart) {
    return NextResponse.json({ message: 'Cart not found' }, { status: 404 });
  }

  const item = await prisma.cartItem.findFirst({ where: { cartId: cart.id, productId } });
  if (!item) {
    return NextResponse.json({ message: 'Product not found in cart' }, { status: 404 });
  }

  const product = await prisma.product.findUnique({ where: { id: productId } });
  const availableStock = typeof product?.quantity === 'number' && Number.isFinite(product.quantity)
    ? Math.max(0, product.quantity)
    : null;

  let newQuantity;

  if (action === 'increase') {
    newQuantity = item.quantity + 1;
  } else if (action === 'decrease') {
    newQuantity = item.quantity - 1;
  } else if (quantityValue !== undefined) {
    const qty = toNumber(quantityValue);
    if (Number.isNaN(qty) || qty < 0) {
      return NextResponse.json({ message: 'quantity must be zero or a positive number' }, { status: 400 });
    }
    newQuantity = qty;
  } else {
    return NextResponse.json({ message: 'action or quantity is required' }, { status: 400 });
  }

  if (availableStock !== null) {
    newQuantity = Math.min(newQuantity, availableStock);
  }

  if (newQuantity <= 0) {
    await prisma.cartItem.delete({ where: { id: item.id } });
  } else {
    await prisma.cartItem.update({ where: { id: item.id }, data: { quantity: newQuantity } });
  }

  const updatedCart = await prisma.cart.findUnique({ where: { id: cart.id }, include: { items: { include: { product: true } } } });

  return NextResponse.json({ message: 'Cart updated', cart: serializeCart(updatedCart) });
}
