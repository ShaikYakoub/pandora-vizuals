import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const publicDir = path.join(process.cwd(), 'public');
const imagesDir = path.join(publicDir, 'images');
const videosDir = path.join(publicDir, 'videos');
const backupRawDir = path.join(imagesDir, 'backup_raw');

// 1. Files to delete (large uncompressed duplicates and raw backups)
const filesToDelete = [
  // Huge duplicate raw folder
  backupRawDir,

  // Uncompressed duplicate JPGs and PNGs that already have optimized WebP counterparts
  path.join(imagesDir, '001.jpg'),
  path.join(imagesDir, '002.jpg'),
  path.join(imagesDir, '003.jpg'),
  path.join(imagesDir, 'portrait_2160x3840.png'),
  path.join(imagesDir, 'agero-footer-bg.png'),
  path.join(imagesDir, 'IMG_20260929_180412.jpg'),
  path.join(imagesDir, 'IMG_20261003_171238.jpg'),
  path.join(imagesDir, 'IMG_20261003_174658.jpg'),
  path.join(imagesDir, 'IMG_20260929_181426.jpg'),
  path.join(imagesDir, 'IMG_20260814_192431_1.jpg'),
  path.join(imagesDir, 'IMG_20260929_181412.jpg'),
  path.join(imagesDir, 'IMG_20260929_181441.jpg'),

  // Redundant raw / duplicate PNG logos and duplicated compressed webp
  path.join(imagesDir, 'PANDORA LOGO UPDATED.png'),
  path.join(imagesDir, 'PANDORA LOGO UPDATED WHITE copy.png'),
  path.join(imagesDir, 'pandora-logo-dark.png'),
  path.join(imagesDir, 'pandora-logo-white.png'),
  path.join(imagesDir, 'pandora-logo-dark-compressed.webp'),
  path.join(imagesDir, 'pandora-logo-white-compressed.webp'),
  path.join(imagesDir, 'techmecs-logo-white.png'),
  path.join(imagesDir, 'techmecs-logo-dark.png'),
  path.join(imagesDir, 'instagram-logo-white.png'),
  path.join(imagesDir, 'instagram-logo-dark.png'),
  path.join(imagesDir, 'facebook-logo-white.png'),
  path.join(imagesDir, 'facebook-logo-dark.png'),
  path.join(imagesDir, 'youtube-logo-white.png'),
  path.join(imagesDir, 'youtube-logo-dark.png'),
];

async function compressImageFile(filePath, options = {}) {
  const stat = fs.statSync(filePath);
  const origSize = stat.size;
  const parsed = path.parse(filePath);
  const fileData = fs.readFileSync(filePath);

  let pipeline = sharp(fileData).rotate();

  if (options.maxWidth || options.maxHeight) {
    pipeline = pipeline.resize({
      width: options.maxWidth,
      height: options.maxHeight,
      fit: 'inside',
      withoutEnlargement: true,
    });
  }

  const quality = options.quality || 82;
  const effort = options.effort ?? 6;

  let buffer;
  if (parsed.ext.toLowerCase() === '.webp') {
    buffer = await pipeline.webp({ quality, effort, smartSubsample: true }).toBuffer();
  } else if (parsed.ext.toLowerCase() === '.jpg' || parsed.ext.toLowerCase() === '.jpeg') {
    buffer = await pipeline.jpeg({ quality, mozjpeg: true, chromaSubsampling: '4:4:4' }).toBuffer();
  } else if (parsed.ext.toLowerCase() === '.png') {
    buffer = await pipeline.png({ compressionLevel: 9, palette: true }).toBuffer();
  }

  if (buffer && buffer.length < origSize) {
    fs.writeFileSync(filePath, buffer);
    const saved = origSize - buffer.length;
    console.log(`⚡ Compressed ${parsed.base}: ${(origSize / 1024).toFixed(1)} KB -> ${(buffer.length / 1024).toFixed(1)} KB (saved ${(saved / 1024).toFixed(1)} KB)`);
    return { origSize, newSize: buffer.length, saved };
  } else {
    console.log(`ℹ️ ${parsed.base}: Already optimal (${(origSize / 1024).toFixed(1)} KB)`);
    return { origSize, newSize: origSize, saved: 0 };
  }
}

async function run() {
  console.log('--- 1. DELETING DUPLICATE AND RAW BACKUP IMAGES ---');
  let deletedBytes = 0;
  let deletedCount = 0;

  for (const item of filesToDelete) {
    if (fs.existsSync(item)) {
      const stat = fs.statSync(item);
      if (stat.isDirectory()) {
        const getDirSize = (d) => {
          let s = 0;
          for (const f of fs.readdirSync(d)) {
            const p = path.join(d, f);
            const st = fs.statSync(p);
            s += st.isDirectory() ? getDirSize(p) : st.size;
          }
          return s;
        };
        const dirSize = getDirSize(item);
        deletedBytes += dirSize;
        fs.rmSync(item, { recursive: true, force: true });
        console.log(`🗑️ Removed directory: ${path.relative(publicDir, item)} (${(dirSize / 1024 / 1024).toFixed(2)} MB)`);
      } else {
        deletedBytes += stat.size;
        deletedCount++;
        fs.unlinkSync(item);
        console.log(`🗑️ Removed duplicate file: ${path.relative(publicDir, item)} (${(stat.size / 1024).toFixed(1)} KB)`);
      }
    }
  }

  console.log(`\nTotal duplicate data deleted: ${(deletedBytes / 1024 / 1024).toFixed(2)} MB (${deletedCount} files + backup directory)\n`);

  console.log('--- 2. COMPRESSING ALL REMAINING ACTIVE IMAGES ---');
  let totalSavedFromCompression = 0;

  // Compress active gallery webp images
  const galleryWebp = [
    '001.webp',
    '002.webp',
    '003.webp',
    'IMG_20260929_180412.webp',
    'IMG_20261003_171238.webp',
    'IMG_20261003_174658.webp',
    'IMG_20260814_192431_1.webp',
    'IMG_20260929_181426.webp',
    'IMG_20260929_181412.webp',
    'IMG_20260929_181441.webp',
    'portrait_2160x3840.webp',
    'agero-footer-bg.webp',
  ];

  for (const name of galleryWebp) {
    const p = path.join(imagesDir, name);
    if (fs.existsSync(p)) {
      const res = await compressImageFile(p, { quality: 80, effort: 6, maxWidth: 1440, maxHeight: 1440 });
      totalSavedFromCompression += res.saved;
    }
  }

  // Compress Techmecs logo webps to optimal size
  for (const name of ['techmecs-logo-white.webp', 'techmecs-logo-dark.webp']) {
    const p = path.join(imagesDir, name);
    if (fs.existsSync(p)) {
      const res = await compressImageFile(p, { quality: 88, effort: 6, maxWidth: 640 });
      totalSavedFromCompression += res.saved;
    }
  }

  // Compress other webp brand logos
  for (const name of [
    'pandora-logo-white.webp',
    'pandora-logo-dark.webp',
    'instagram-logo-white.webp',
    'instagram-logo-dark.webp',
    'facebook-logo-white.webp',
    'facebook-logo-dark.webp',
    'youtube-logo-white.webp',
    'youtube-logo-dark.webp',
  ]) {
    const p = path.join(imagesDir, name);
    if (fs.existsSync(p)) {
      const res = await compressImageFile(p, { quality: 85, effort: 6 });
      totalSavedFromCompression += res.saved;
    }
  }

  // Compress video thumbnails in public/videos
  if (fs.existsSync(videosDir)) {
    for (const f of fs.readdirSync(videosDir)) {
      if (/\.(jpg|jpeg|png)$/i.test(f)) {
        const p = path.join(videosDir, f);
        const res = await compressImageFile(p, { quality: 80, effort: 6 });
        totalSavedFromCompression += res.saved;
      }
    }
  }

  console.log('====================================================');
  console.log(`🎉 Total saved from deleting duplicates: ${(deletedBytes / 1024 / 1024).toFixed(2)} MB`);
  console.log(`🎉 Total additional savings from compression: ${(totalSavedFromCompression / 1024).toFixed(1)} KB`);
  console.log(`🎉 GRAND TOTAL REDUCTION: ${((deletedBytes + totalSavedFromCompression) / 1024 / 1024).toFixed(2)} MB`);
  console.log('====================================================');
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
