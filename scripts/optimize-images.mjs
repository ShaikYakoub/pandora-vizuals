import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const imagesDir = path.join(process.cwd(), 'public', 'images');
const backupDir = path.join(imagesDir, 'backup_raw');

if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
}

const targetFiles = [
  'portrait_2160x3840.png',
  'IMG_20260929_180412.jpg',
  'IMG_20261003_171238.jpg',
  'IMG_20261003_174658.jpg',
  'IMG_20260814_192431_1.jpg',
  'IMG_20260929_181426.jpg',
  'IMG_20260929_181412.jpg',
  'IMG_20260929_181441.jpg',
  'agero-footer-bg.png',
];

async function optimizeImages() {
  console.log('🚀 Starting upright, responsive, lightning-fast image optimization...\n');
  let originalTotal = 0;
  let webpTotal = 0;
  let fallbackTotal = 0;

  for (const file of targetFiles) {
    const backupPath = path.join(backupDir, file);
    const srcPath = path.join(imagesDir, file);

    if (!fs.existsSync(backupPath)) {
      if (fs.existsSync(srcPath)) {
        fs.copyFileSync(srcPath, backupPath);
      } else {
        console.warn(`File not found: ${file}`);
        continue;
      }
    }

    const origStats = fs.statSync(backupPath);
    const origSize = origStats.size;
    originalTotal += origSize;

    const parsed = path.parse(file);
    const isBg = file.includes('agero-footer-bg');
    const maxDim = isBg ? 1600 : 1440;

    // 1. Generate crisp, auto-rotated, properly proportioned WebP
    const webpFilename = `${parsed.name}.webp`;
    const webpPath = path.join(imagesDir, webpFilename);

    const webpBuffer = await sharp(backupPath)
      .rotate() // Auto-orient EXIF so portrait images stay vertical and upright
      .resize({
        width: maxDim,
        height: maxDim,
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({
        quality: isBg ? 80 : 84,
        effort: 6,
        smartSubsample: true,
      })
      .toBuffer();

    fs.writeFileSync(webpPath, webpBuffer);
    webpTotal += webpBuffer.length;

    // 2. Also generate matching upright, resized fallback (.jpg or .png)
    let fallbackBuffer;
    if (parsed.ext.toLowerCase() === '.png') {
      fallbackBuffer = await sharp(backupPath)
        .rotate()
        .resize({
          width: maxDim,
          height: maxDim,
          fit: 'inside',
          withoutEnlargement: true,
        })
        .png({
          quality: 85,
          compressionLevel: 9,
          palette: true, // Color palette quantization for lightweight PNG
        })
        .toBuffer();
    } else {
      fallbackBuffer = await sharp(backupPath)
        .rotate()
        .resize({
          width: maxDim,
          height: maxDim,
          fit: 'inside',
          withoutEnlargement: true,
        })
        .jpeg({
          quality: 84,
          mozjpeg: true,
          chromaSubsampling: '4:4:4',
        })
        .toBuffer();
    }

    fs.writeFileSync(srcPath, fallbackBuffer);
    fallbackTotal += fallbackBuffer.length;

    const finalMeta = await sharp(webpBuffer).metadata();
    const webpSavings = ((1 - webpBuffer.length / origSize) * 100).toFixed(1);

    console.log(`📸 ${file} ➔ ${finalMeta.width}x${finalMeta.height} (upright)`);
    console.log(`   - Original:  ${(origSize / 1024).toFixed(0)} KB`);
    console.log(`   - WebP:      ${(webpBuffer.length / 1024).toFixed(0)} KB (${webpSavings}% saved)`);
    console.log(`   - Fallback:  ${(fallbackBuffer.length / 1024).toFixed(0)} KB\n`);
  }

  console.log('==============================================');
  console.log(`📦 Original Total:          ${(originalTotal / 1024 / 1024).toFixed(2)} MB`);
  console.log(`✨ Optimized WebP Total:    ${(webpTotal / 1024).toFixed(0)} KB (${((1 - webpTotal / originalTotal) * 100).toFixed(1)}% total saved)`);
  console.log(`⚡ Optimized Fallback Total: ${(fallbackTotal / 1024).toFixed(0)} KB (${((1 - fallbackTotal / originalTotal) * 100).toFixed(1)}% total saved)`);
  console.log('==============================================');
}

optimizeImages().catch((err) => {
  console.error('Optimization failed:', err);
  process.exit(1);
});
