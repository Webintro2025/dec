import { NextResponse } from 'next/server';
import prisma from '../../utils/prisma';
import fs from 'fs';
import path from 'path';

// Save uploaded file to public/uploads/products and return a public URL (/uploads/products/..)
async function saveFileToUploads(file) {
  if (!file || typeof file.arrayBuffer !== 'function' || file.size === 0) return null;
  const arrayBuffer = await file.arrayBuffer();
  let buffer = Buffer.from(arrayBuffer);

  // ensure uploads dir exists
  const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'products');
  fs.mkdirSync(uploadDir, { recursive: true });

  try {
    const sharpModule = await import('sharp');
    const sharp = sharpModule && (sharpModule.default || sharpModule);
    if (typeof sharp === 'function') {
      const img = sharp(buffer);
      const meta = await img.metadata();
      const needResize = (meta.width && meta.width > 4000) || (meta.height && meta.height > 6000);
      if (needResize) {
        const fmt = (meta.format || '').toLowerCase();
        if (fmt === 'png') {
          buffer = await img.resize(4000, 6000, { fit: 'inside', withoutEnlargement: true }).png({ compressionLevel: 2 }).toBuffer();
        } else if (fmt === 'webp') {
          buffer = await img.resize(4000, 6000, { fit: 'inside', withoutEnlargement: true }).webp({ quality: 90 }).toBuffer();
        } else {
          buffer = await img.resize(4000, 6000, { fit: 'inside', withoutEnlargement: true }).jpeg({ quality: 90 }).toBuffer();
        }
      }
    }
  } catch (e) {
    // sharp not installed or failed — continue with original buffer
  }

  // derive extension from file.type or fallback to .jpg
  const mime = typeof file.type === 'string' && file.type ? file.type : 'image/jpeg';
  const ext = mime.split('/')[1] ? mime.split('/')[1].split(';')[0] : 'jpg';
  const filename = `${cryptoRandomFilename()}.${ext}`;
  const outPath = path.join(uploadDir, filename);
  fs.writeFileSync(outPath, buffer);

  // Return public URL path
  return `/uploads/products/${filename}`;
}

function cryptoRandomFilename() {
  // simple UUID using random values
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c => (c ^ cryptoRandomByte() & 15 >> c / 4).toString(16));
}

function cryptoRandomByte() {
  // use crypto random if available
  try {
    const crypto = globalThis?.crypto || require('crypto');
    if (crypto && typeof crypto.randomBytes === 'function') {
      return crypto.randomBytes(1)[0];
    }
    return Math.floor(Math.random() * 256);
  } catch (e) {
    return Math.floor(Math.random() * 256);
  }
}

function payloadError(message, status = 400) {
  const err = new Error(message);
  err.status = status;
  return err;
}

async function parseJsonPayload(request) {
  try {
    const text = await request.text();
    if (!text) return {};
    const body = JSON.parse(text);
    const incomingImages = Array.isArray(body?.images) ? body.images : (typeof body?.images === 'string' ? [body.images] : []);
    return {
      name: body?.name,
      description: body?.description,
      category: body?.category,
      price: body?.price,
      quantity: body?.quantity,
      dimension: body?.dimension,
      materialCare: body?.materialCare ?? body?.material ?? body?.care,
      images: incomingImages.filter(Boolean).map((s) => (typeof s === 'string' ? s.trim() : s)),
    };
  } catch (err) {
    console.error('Failed to parse JSON payload', err?.message || err);
    throw payloadError('Invalid JSON payload', 400);
  }
}

async function parseBody(req) {
  const contentType = req.headers.get('content-type') || '';
  const fallback = req.clone();
  if (contentType.includes('multipart/form-data')) {
    try {
      const formData = await req.formData();
      const entries = formData.getAll('images');
      const saved = [];
      for (const ent of entries) {
        if (ent && typeof ent === 'object' && typeof ent.arrayBuffer === 'function') {
          // Save uploaded file to disk and return a public URL
          try {
            const stored = await saveFileToUploads(ent);
            if (stored) saved.push(stored);
          } catch (e) {
            // if saving fails, skip this file but log the error
            console.error('Failed to save uploaded file', e?.message || e);
          }
        }
      }
      return {
        name: formData.get('name'),
        description: formData.get('description'),
        category: formData.get('category'),
        price: formData.get('price'),
        quantity: formData.get('quantity'),
        dimension: formData.get('dimension'),
        materialCare: formData.get('materialCare') ?? formData.get('material') ?? formData.get('care'),
        images: saved,
      };
    } catch (err) {
      console.error('Failed to parse multipart payload', err?.message || err);
      return await parseJsonPayload(fallback);
    }
  }
  return await parseJsonPayload(req);
}

function toNumber(v) {
  if (v === null || v === undefined) return undefined;
  if (typeof v === 'number') return Number.isFinite(v) ? v : NaN;
  if (typeof v === 'string') {
    const t = v.trim();
    if (!t) return undefined;
    const n = Number(t);
    return Number.isNaN(n) ? NaN : n;
  }
  return NaN;
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get('id');
  const limitParam = parseInt(searchParams.get('limit') || '', 10);
  const maxLimit = 2000;
  const defaultLimit = 1000;
  const resolvedLimit = Number.isFinite(limitParam) && limitParam > 0 ? Math.min(limitParam, maxLimit) : defaultLimit;

  if (productId) {
    try {
      const product = await prisma.product.findUnique({
        where: { id: productId },
        select: {
          id: true,
          name: true,
          description: true,
          price: true,
          quantity: true,
          dimension: true,
          materialCare: true,
          images: true,
          category: { select: { id: true, name: true } },
          createdAt: true,
        },
      });
      if (!product) return NextResponse.json({ message: 'Product not found' }, { status: 404 });
      return NextResponse.json({ product });
    } catch (err) {
      console.error('Failed to fetch product by id', err?.message || err);
      return NextResponse.json({ message: 'Invalid product id' }, { status: 400 });
    }
  }

  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
      take: resolvedLimit,
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        quantity: true,
        dimension: true,
        materialCare: true,
        images: true,
        category: { select: { id: true, name: true } },
        createdAt: true,
      },
    });

    const mapped = products.map((p) => {
      const thumbnail = Array.isArray(p.images) && p.images.length > 0 ? p.images[0] : null;
      const { images, ...rest } = p;
      return { ...rest, thumbnail };
    });

    return NextResponse.json({ products: mapped, meta: { total: mapped.length, limit: resolvedLimit } });
  } catch (err) {
    console.error('Failed to fetch products list', err?.message || err);
    return NextResponse.json({ message: 'Unable to fetch products' }, { status: 500 });
  }
}

export async function POST(req) {
  let payload;
  try {
    payload = await parseBody(req);
  } catch (err) {
    const status = err.status || 500;
    const message = err.message || 'Unable to process request body.';
    return NextResponse.json({ message }, { status });
  }

  const { name, description, category, price, quantity, dimension, materialCare, images } = payload;

  if (!name || !name.trim()) return NextResponse.json({ message: 'Product name is required' }, { status: 400 });
  if (!category || !`${category}`.trim()) return NextResponse.json({ message: 'Category is required' }, { status: 400 });

  const priceNum = toNumber(price);
  if (priceNum === undefined || Number.isNaN(priceNum)) return NextResponse.json({ message: 'Price must be a valid number' }, { status: 400 });
  const quantityNum = toNumber(quantity);
  if (Number.isNaN(quantityNum)) return NextResponse.json({ message: 'Quantity must be a valid number' }, { status: 400 });

  // verify category exists
  const categoryDoc = await prisma.category.findUnique({ where: { id: category } });
  if (!categoryDoc) return NextResponse.json({ message: 'Invalid category specified' }, { status: 400 });

  const normalized = name.trim();

  try {
    const created = await prisma.product.create({
      data: {
        name: normalized,
        description: description?.trim(),
        category: { connect: { id: category } },
        price: priceNum,
        quantity: quantityNum ?? 0,
        dimension: dimension?.trim(),
        materialCare: materialCare?.trim(),
        images: Array.isArray(images) ? images : [],
      },
      include: { category: { select: { id: true, name: true } } },
    });

    return NextResponse.json({ message: 'Product created', product: created }, { status: 201 });
  } catch (err) {
    console.error('Failed to create product', err?.message || err);
    return NextResponse.json({ message: 'Unable to create product' }, { status: 500 });
  }
}
