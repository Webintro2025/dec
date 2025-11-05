import { NextResponse } from 'next/server';
import prisma from '../../../utils/prisma';

export async function GET(req) {
  try {
    // safe searchParams helper: handle relative req.url values by providing a base
    function getSearchParamsFromReq(r) {
      try { return new URL(r.url).searchParams; } catch (e) {
        const host = r.headers?.get('host') || r.headers?.host || 'localhost:3000';
        const proto = r.headers?.get('x-forwarded-proto') || 'http';
        return new URL(r.url, `${proto}://${host}`).searchParams;
      }
    }

    const { searchParams } = (() => ({ searchParams: getSearchParamsFromReq(req) }))();
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
      let base;
      try {
        // If req.url is already absolute this will work
        base = new URL(req.url).origin;
      } catch (e) {
        const host = req.headers?.get('host') || req.headers?.host || 'localhost:3000';
        const proto = req.headers?.get('x-forwarded-proto') || 'http';
        base = `${proto}://${host}`;
      }
      const redirectUrl = new URL(data, base).toString();
      return NextResponse.redirect(redirectUrl);
    }

    return NextResponse.json({ message: 'Unsupported image format' }, { status: 415 });
  } catch (err) {
    console.error('Failed to serve product image', err);
    return NextResponse.json({ message: 'Unable to fetch image' }, { status: 500 });
  }
}
