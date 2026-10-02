import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get('content-type') || '';

    // Handle JSON payload with base64
    if (contentType.includes('application/json')) {
      const { dataUrl, filename } = await request.json();
      if (!dataUrl) {
        return NextResponse.json({ error: 'Missing dataUrl' }, { status: 400 });
      }

      // If already a base64 or external url, can return it or write to disk
      try {
        const matches = dataUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        if (matches && matches.length === 3) {
          const extension = matches[1].split('/')[1] || 'png';
          const buffer = Buffer.from(matches[2], 'base64');
          const cleanName = `${Date.now()}-${(filename || 'image').replace(/[^a-zA-Z0-9.-]/g, '_')}.${extension}`;
          
          const uploadDir = path.join(process.cwd(), 'public', 'uploads');
          if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
          }
          
          fs.writeFileSync(path.join(uploadDir, cleanName), buffer);
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

      const extension = path.extname(file.name) || '.jpg';
      const cleanName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      fs.writeFileSync(path.join(uploadDir, cleanName), buffer);
      return NextResponse.json({ url: `/uploads/${cleanName}` });
    }

    return NextResponse.json({ error: 'Unsupported content type' }, { status: 400 });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: error.message || 'Upload failed' }, { status: 500 });
  }
}
