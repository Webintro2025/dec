import { NextResponse } from 'next/server';
import formidable from 'formidable';
import fs from 'fs/promises';
import path from 'path';
import prisma from '../../utils/prisma';

export const config = {
  api: {
    bodyParser: false,
  },
};

const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'gallery');

async function parseForm(req) {
  return new Promise((resolve, reject) => {
    const form = formidable({
      multiples: false,
      uploadDir,
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024, // 10MB
      filter: ({ name, originalFilename, mimetype }) => {
        return mimetype && mimetype.startsWith('image/');
      },
    });
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
}

export async function POST(req) {
  try {
    await fs.mkdir(uploadDir, { recursive: true });
    const formData = await req.formData();
    // Accept both single and multiple files (key: 'images')
    let files = formData.getAll('images');
    if (!files || files.length === 0) {
      // fallback to single 'image' key for backward compatibility
      const single = formData.get('image');
      if (single && typeof single !== 'string') files = [single];
    }
    if (!files || files.length === 0 || typeof files[0] === 'string') {
      return NextResponse.json({ error: 'No images uploaded.' }, { status: 400 });
    }
    const createdImages = [];
    for (const file of files) {
      if (!file || typeof file === 'string') continue;
      const buffer = Buffer.from(await file.arrayBuffer());
      const filename = `${Date.now()}_${Math.random().toString(36).slice(2,8)}_${file.name.replace(/\s+/g, '_')}`;
      const filepath = path.join(uploadDir, filename);
      await fs.writeFile(filepath, buffer);
      const url = `/uploads/gallery/${filename}`;
      const image = await prisma.galleryImage.create({ data: { url } });
      createdImages.push(image);
    }
    return NextResponse.json({ success: true, images: createdImages });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const pageSize = 20;
    const skip = (page - 1) * pageSize;
    const [images, total] = await Promise.all([
      prisma.galleryImage.findMany({
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.galleryImage.count(),
    ]);
    return NextResponse.json({
      images,
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
