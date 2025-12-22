import { NextResponse } from 'next/server';
import prisma from '../../utils/prisma';
import fs from 'fs';
import path from 'path';

// Helper to save uploaded file (reuse from route.js if needed)
async function saveFileToUploads(file) {
  if (!file || typeof file.arrayBuffer !== 'function' || file.size === 0) return null;
  const arrayBuffer = await file.arrayBuffer();
  let buffer = Buffer.from(arrayBuffer);
  const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'products');
  fs.mkdirSync(uploadDir, { recursive: true });
  const mime = typeof file.type === 'string' && file.type ? file.type : 'image/jpeg';
  const ext = mime.split('/')[1] ? mime.split('/')[1].split(';')[0] : 'jpg';
  const filename = `${Date.now()}_${Math.random().toString(36).slice(2,8)}.${ext}`;
  const outPath = path.join(uploadDir, filename);
  fs.writeFileSync(outPath, buffer);
  return `/uploads/products/${filename}`;
}

export async function PATCH(req) {
  let productId;
  let images = [];
  const contentType = req.headers.get('content-type') || '';
  if (contentType.includes('multipart/form-data')) {
    try {
      const formData = await req.formData();
      productId = formData.get('id') || formData.get('productId');
      const files = formData.getAll('images');
      for (const file of files) {
        if (file && typeof file === 'object' && typeof file.arrayBuffer === 'function') {
          const url = await saveFileToUploads(file);
          if (url) images.push(url);
        }
      }
    } catch (err) {
      return NextResponse.json({ message: 'Invalid multipart payload' }, { status: 400 });
    }
  } else {
    try {
      const body = await req.json();
      productId = body.id || body.productId;
      if (Array.isArray(body.images)) images = body.images.filter(Boolean);
      else if (typeof body.images === 'string') images = [body.images];
    } catch (err) {
      return NextResponse.json({ message: 'Invalid JSON payload' }, { status: 400 });
    }
  }

  if (!productId) {
    return NextResponse.json({ message: 'Product id is required' }, { status: 400 });
  }
  if (!images.length) {
    return NextResponse.json({ message: 'At least one image is required' }, { status: 400 });
  }

  try {
    const updated = await prisma.product.update({
      where: { id: productId },
      data: { images },
      select: { id: true, images: true },
    });
    return NextResponse.json({ message: 'Product images updated', product: updated });
  } catch (err) {
    return NextResponse.json({ message: 'Unable to update product images', error: err?.message }, { status: 500 });
  }
}

