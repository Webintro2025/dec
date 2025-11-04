import { NextResponse } from 'next/server';
import prisma from '../../utils/prisma';

function toNumber(value, { allowZero = false } = {}) {
  if (value === null || value === undefined) return undefined;
  if (typeof value === 'number') return Number.isFinite(value) ? value : NaN;
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) return allowZero ? 0 : undefined;
    const num = Number(trimmed);
    return Number.isNaN(num) ? NaN : num;
  }
  return NaN;
}

function requiredString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function buildOrderNumber(prefix = 'ORD') {
  const timestamp = Date.now().toString(36).toUpperCase();
  const randomPart = Math.floor(Math.random() * 1_000_000)
    .toString(36)
    .toUpperCase()
    .padStart(4, '0');
  return `${prefix}-${timestamp}-${randomPart}`;
}

async function resolveShipping({ userId, addressId, shipping }) {
  if (addressId) {
    const record = await prisma.customerInfo.findFirst({ where: { id: addressId, userId } });
    if (!record) {
      throw new Error('Address not found for this user');
    }
    return {
      name: record.name,
      email: record.email,
      phone: record.phone,
      addressLine1: record.addressLine1,
      addressLine2: record.addressLine2,
      city: record.city,
      state: record.state,
      postalCode: record.postalCode,
      country: record.country,
    };
  }

  const requiredFields = [
    'name',
    'phone',
    'addressLine1',
    'city',
    'state',
    'postalCode',
    'country',
  ];

  if (!shipping || typeof shipping !== 'object') {
    throw new Error('Shipping details are required');
  }

  for (const field of requiredFields) {
    if (!requiredString(shipping[field])) {
      throw new Error(`Shipping field ${field} is required`);
    }
  }

  return {
    name: shipping.name.trim(),
    email: shipping.email?.trim().toLowerCase(),
    phone: shipping.phone.trim(),
    addressLine1: shipping.addressLine1.trim(),
    addressLine2: shipping.addressLine2?.trim(),
    city: shipping.city.trim(),
    state: shipping.state.trim(),
    postalCode: shipping.postalCode.trim(),
    country: shipping.country.trim(),
  };
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const orderId = searchParams.get('orderId');
  if (orderId) {
    const order = await prisma.order.findUnique({ where: { id: orderId }, include: { items: { include: { product: true } } } });
    if (!order) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }
    if (userId && order.userId !== userId.trim()) {
      return NextResponse.json({ message: 'Order not found for this user' }, { status: 404 });
    }
    return NextResponse.json({ order });
  }

  if (!requiredString(userId)) {
    return NextResponse.json({ message: 'userId query parameter is required' }, { status: 400 });
  }

  const orders = await prisma.order.findMany({
    where: { userId: userId.trim() },
    orderBy: { createdAt: 'desc' },
    include: { items: { include: { product: true } } },
  });

  return NextResponse.json({ userId: userId.trim(), orders });
}

export async function POST(request) {
  let body;

  try {
    body = await request.json();
  } catch (err) {
    return NextResponse.json({ message: 'Invalid JSON payload' }, { status: 400 });
  }

  const { userId, addressId, shipping, items } = body || {};

  if (!requiredString(userId)) {
    return NextResponse.json({ message: 'userId is required' }, { status: 400 });
  }

  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ message: 'At least one product item is required' }, { status: 400 });
  }

  let shippingInfo;
  try {
    shippingInfo = await resolveShipping({ userId: userId.trim(), addressId, shipping });
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 400 });
  }

  const orderItemsData = [];
  let total = 0;

  // Validate products and compute totals before creating anything
  for (const item of items) {
    const productId = item?.productId?.trim();
    const quantityRaw = item?.quantity ?? 1;
    const quantity = toNumber(quantityRaw, { allowZero: false }) ?? 1;

    if (!productId) {
      return NextResponse.json({ message: 'Each item must include productId' }, { status: 400 });
    }
    if (Number.isNaN(quantity) || quantity < 1) {
      return NextResponse.json({ message: 'Item quantity must be a positive number' }, { status: 400 });
    }

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      return NextResponse.json({ message: `Product not found: ${productId}` }, { status: 400 });
    }

    if (typeof product.price !== 'number') {
      return NextResponse.json({ message: `Product price invalid for ${product.name}` }, { status: 400 });
    }

    if (typeof product.quantity === 'number' && product.quantity < quantity) {
      return NextResponse.json({ message: `Only ${product.quantity} left for ${product.name}` }, { status: 400 });
    }

    const subtotal = product.price * quantity;
    total += subtotal;

    orderItemsData.push({ productId: product.id, name: product.name, price: product.price, quantity, subtotal });
  }

  const orderNumber = buildOrderNumber();

  // Create order and associated items and update product stocks in a transaction
  const createdOrder = await prisma.$transaction(async (tx) => {
    const o = await tx.order.create({
      data: {
        userId: userId.trim(),
        orderNumber,
        shipName: shippingInfo.name,
        shipEmail: shippingInfo.email,
        shipPhone: shippingInfo.phone,
        shipAddressLine1: shippingInfo.addressLine1,
        shipAddressLine2: shippingInfo.addressLine2,
        shipCity: shippingInfo.city,
        shipState: shippingInfo.state,
        shipPostalCode: shippingInfo.postalCode,
        shipCountry: shippingInfo.country,
        total,
      },
    });

    for (const itemData of orderItemsData) {
      await tx.orderItem.create({
        data: {
          orderId: o.id,
          productId: itemData.productId,
          name: itemData.name,
          price: itemData.price,
          quantity: itemData.quantity,
          subtotal: itemData.subtotal,
        },
      });

      // decrement product stock if numeric
      const prod = await tx.product.findUnique({ where: { id: itemData.productId } });
      if (typeof prod.quantity === 'number') {
        const newQty = Math.max(0, prod.quantity - itemData.quantity);
        await tx.product.update({ where: { id: prod.id }, data: { quantity: newQty } });
      }
    }

    return tx.order.findUnique({ where: { id: o.id }, include: { items: { include: { product: true } } } });
  });

  return NextResponse.json({ message: 'Order created', order: createdOrder }, { status: 201 });
}
