import { NextResponse } from 'next/server';
import prisma from '../../utils/prisma';
import fs from 'fs';
import path from 'path';

// Helper: safely get searchParams from a Request-like object.
// Some environments provide a relative url ("/api/...") which new URL() rejects without a base.
function getSearchParamsFromReq(req) {
  try {
    const url = new URL(req.url);
    return url.searchParams;
  } catch (e) {
    // fallback: build an absolute base using headers when available
    try {
      const host = req.headers?.get('host') || req.headers?.host || 'localhost:3000';
      const proto = req.headers?.get('x-forwarded-proto') || 'http';
      const url = new URL(req.url, `${proto}://${host}`);
      return url.searchParams;
    } catch (err) {
      // As a last resort, try with a localhost base
      const url = new URL(req.url, 'http://localhost:3000');
      return url.searchParams;
    }
  }
}

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
  const searchParams = getSearchParamsFromReq(req);
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
    // support simple search by name/description with ?search=term or ?q=term
    const searchTermRaw = searchParams.get('search') || searchParams.get('q');
    const where = searchTermRaw
      ? {
          OR: [
            { name: { contains: searchTermRaw, mode: 'insensitive' } },
            { description: { contains: searchTermRaw, mode: 'insensitive' } },
          ],
        }
      : undefined;

    const products = await prisma.product.findMany({
      where,
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

  // Normalize category input: accept id string, an object with id, or a category name
  let categoryValue = category;
  try {
    if (categoryValue && typeof categoryValue === 'string') {
      const t = categoryValue.trim();
      // If body sent a JSON stringified object, try parse
      if ((t.startsWith('{') && t.endsWith('}')) || (t.startsWith('[') && t.endsWith(']'))) {
        try {
          const parsed = JSON.parse(t);
          if (parsed?.id) categoryValue = parsed.id;
          else if (parsed?.name) categoryValue = parsed.name;
        } catch (e) {
          // ignore
        }
      }
    } else if (categoryValue && typeof categoryValue === 'object') {
      if (categoryValue.id) categoryValue = categoryValue.id;
      else if (categoryValue.name) categoryValue = categoryValue.name;
    }
  } catch (e) {
    // ignore normalization errors
  }

  if (!categoryValue || !String(categoryValue).trim()) return NextResponse.json({ message: 'Category is required' }, { status: 400 });

  const priceNum = toNumber(price);
  if (priceNum === undefined || Number.isNaN(priceNum)) return NextResponse.json({ message: 'Price must be a valid number' }, { status: 400 });
  const quantityNum = toNumber(quantity);
  if (Number.isNaN(quantityNum)) return NextResponse.json({ message: 'Quantity must be a valid number' }, { status: 400 });

  // verify category exists. Try id lookup first, then fallback to name match (case-insensitive)
  let categoryDoc = null;
  const attempted = [];
  const candidate = String(categoryValue).trim();
  attempted.push({ kind: 'raw', value: candidate });

  // try by id
  try {
    categoryDoc = await prisma.category.findUnique({ where: { id: candidate } });
  } catch (e) {
    // ignore
  }

  // try by name if id lookup failed
  if (!categoryDoc) {
    try {
      categoryDoc = await prisma.category.findFirst({ where: { name: { equals: candidate, mode: 'insensitive' } } });
      attempted.push({ kind: 'name', value: candidate });
    } catch (e) {
      // ignore
    }
  }

  if (!categoryDoc) return NextResponse.json({ message: 'Invalid category specified', debug: { attempted } }, { status: 400 });

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

export async function DELETE(req) {
  try {
    const searchParams = getSearchParamsFromReq(req);
    const debugMode = (searchParams.get('debug') === '1' || process.env.NODE_ENV !== 'production');

    // collect candidate id values from query and body
    let productId = searchParams.get('id');
    let bodyId;
    try {
      const text = await req.text();
      if (text) {
        const body = JSON.parse(text);
        bodyId = body?.id || body?.productId || body?.product_id;
      }
    } catch (e) {
      // ignore parse errors (body may be empty)
    }
    if (!productId) productId = bodyId;

    if (!productId) return NextResponse.json({ message: 'Product id is required' }, { status: 400 });

    // normalize: trim, remove surrounding quotes, try decodeURIComponent
    const candidateRaw = String(productId);
    const candidateTrim = candidateRaw.trim();
    const candidateStripQuotes = candidateTrim.replace(/^['"]|['"]$/g, '');
    let candidateDecoded;
    try {
      candidateDecoded = decodeURIComponent(candidateStripQuotes);
    } catch (e) {
      candidateDecoded = candidateStripQuotes;
    }

    const tried = [candidateRaw, candidateTrim, candidateStripQuotes];
    if (candidateDecoded && !tried.includes(candidateDecoded)) tried.push(candidateDecoded);

    // try findUnique first, then fall back to findFirst with OR of attempted values
    let existing = null;
    try {
      existing = await prisma.product.findUnique({ where: { id: candidateStripQuotes } });
    } catch (e) {
      // ignore
    }

    if (!existing) {
      try {
        existing = await prisma.product.findFirst({ where: { OR: tried.map((v) => ({ id: v })) } });
      } catch (e) {
        // ignore
      }
    }

    if (!existing) {
      const payload = { message: 'Product not found' };
      if (debugMode) payload.debug = { attempted: tried };
      return NextResponse.json(payload, { status: 404 });
    }

    const pid = existing.id;

    // delete dependent records first to avoid FK constraint issues
    await prisma.$transaction([
      prisma.orderItem.deleteMany({ where: { productId: pid } }),
      prisma.cartItem.deleteMany({ where: { productId: pid } }),
      prisma.product.delete({ where: { id: pid } }),
    ]);

    // attempt to remove uploaded images from disk (only for local uploads under /uploads/products)
    try {
      if (Array.isArray(existing.images)) {
        for (const img of existing.images) {
          if (typeof img === 'string' && img.startsWith('/uploads/products/')) {
            const rel = img.replace(/^\//, '');
            const fp = path.join(process.cwd(), 'public', rel);
            try {
              if (fs.existsSync(fp)) fs.unlinkSync(fp);
            } catch (e) {
              // non-fatal
            }
          }
        }
      }
    } catch (e) {
      // ignore file cleanup errors
    }

    const resp = { message: 'Product deleted' };
    if (debugMode) resp.deleted = { id: pid };
    return NextResponse.json(resp);
  } catch (err) {
    console.error('Failed to delete product', err?.message || err);
    return NextResponse.json({ message: 'Unable to delete product' }, { status: 500 });
  }
}
