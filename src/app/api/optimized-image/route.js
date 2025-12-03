import { NextResponse } from 'next/server';
import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';

// GET /api/optimized-image?src=/uploads/gallery/filename.jpg&w=800&q=80
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const src = searchParams.get('src');
    const width = parseInt(searchParams.get('w') || '800', 10);
    const quality = parseInt(searchParams.get('q') || '80', 10);
    if (!src || !src.startsWith('/uploads/gallery/')) {
      return NextResponse.json({ error: 'Invalid image path.' }, { status: 400 });
    }
    const filePath = path.join(process.cwd(), 'public', src);
    const fileBuffer = await fs.readFile(filePath);
    const optimized = await sharp(fileBuffer)
      .resize({ width, withoutEnlargement: true })
      .jpeg({ quality, mozjpeg: true })
      .toBuffer();
    return new NextResponse(optimized, {
      status: 200,
      headers: {
        'Content-Type': 'image/jpeg',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
