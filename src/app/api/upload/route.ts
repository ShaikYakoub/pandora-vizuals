import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get('content-type') || '';

    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Handle JSON payload with base64
    if (contentType.includes('application/json')) {
      const { dataUrl, filename } = await request.json();
      if (!dataUrl) {
        return NextResponse.json({ error: 'Missing dataUrl' }, { status: 400 });
      }

      try {
        const matches = dataUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        if (matches && matches.length === 3) {
          const buffer = Buffer.from(matches[2], 'base64');
          const baseName = (filename || 'image').replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9.-]/g, '_');
          
          let finalBuffer = buffer;
          let ext = 'webp';

          try {
            finalBuffer = await sharp(buffer)
              .webp({ quality: 86, effort: 6, smartSubsample: true })
              .toBuffer();
          } catch (sharpErr) {
            console.warn('Sharp optimization bypassed, saving original buffer:', sharpErr);
            ext = matches[1].split('/')[1] || 'png';
          }

          const cleanName = `${Date.now()}-${baseName}.${ext}`;
          fs.writeFileSync(path.join(uploadDir, cleanName), finalBuffer);
          return NextResponse.json({ url: `/uploads/${cleanName}` });
        }
      } catch (err) {
        console.warn('Could not save to public/uploads, falling back to dataUrl:', err);
      }
      return NextResponse.json({ url: dataUrl });
    }

    // Handle multipart/form-data
    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const file = formData.get('file') as File | null;

      if (!file) {
        return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const baseName = path.parse(file.name).name.replace(/[^a-zA-Z0-9.-]/g, '_');

      let finalBuffer = buffer;
      let ext = 'webp';

      try {
        finalBuffer = await sharp(buffer)
          .webp({ quality: 86, effort: 6, smartSubsample: true })
          .toBuffer();
      } catch (sharpErr) {
        console.warn('Sharp optimization bypassed, saving original buffer:', sharpErr);
        ext = path.extname(file.name).replace('.', '') || 'jpg';
      }

      const cleanName = `${Date.now()}-${baseName}.${ext}`;
      fs.writeFileSync(path.join(uploadDir, cleanName), finalBuffer);
      return NextResponse.json({ url: `/uploads/${cleanName}` });
    }

    return NextResponse.json({ error: 'Unsupported content type' }, { status: 400 });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: error.message || 'Upload failed' }, { status: 500 });
  }
}
