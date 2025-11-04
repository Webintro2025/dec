import { NextResponse } from 'next/server';
import prisma from '../../../utils/prisma';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('productId');
    const idx = parseInt(searchParams.get('index') || '0', 10);

    if (!productId) return NextResponse.json({ message: 'productId required' }, { status: 400 });

    const product = await prisma.product.findUnique({ where: { id: productId }, select: { images: true } });
    if (!product) return NextResponse.json({ message: 'Product not found' }, { status: 404 });

    const images = Array.isArray(product.images) ? product.images : [];
    if (idx < 0 || idx >= images.length) return NextResponse.json({ message: 'Image not found' }, { status: 404 });

    const data = images[idx];
    if (typeof data === 'string' && data.startsWith('data:')) {
      const comma = data.indexOf(',');
      const meta = data.substring(5, comma); // e.g. image/jpeg;base64
      const mime = meta.split(';')[0] || 'application/octet-stream';
      const isBase64 = meta.includes('base64');
      const payload = data.substring(comma + 1);
      const buffer = Buffer.from(payload, isBase64 ? 'base64' : 'utf8');

      return new Response(buffer, {
        status: 200,
        headers: {
          'Content-Type': mime,
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      });
    }

    if (typeof data === 'string' && (data.startsWith('http://') || data.startsWith('https://'))) {
      return NextResponse.redirect(data);
    }

    // If saved as a public path (e.g. "/uploads/products/.."), redirect to that path so Next.js serves it from /public
    if (typeof data === 'string' && data.startsWith('/')) {
      // Build absolute URL relative to the incoming request (works for localhost and deployed sites)
      const redirectUrl = new URL(data, req.url).toString();
      return NextResponse.redirect(redirectUrl);
    }

    return NextResponse.json({ message: 'Unsupported image format' }, { status: 415 });
  } catch (err) {
    console.error('Failed to serve product image', err);
    return NextResponse.json({ message: 'Unable to fetch image' }, { status: 500 });
  }
}
