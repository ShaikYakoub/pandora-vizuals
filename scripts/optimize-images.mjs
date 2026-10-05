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
  console.log('🚀 Starting high-fidelity image optimization...\n');
  let originalTotal = 0;
  let webpTotal = 0;
  let inPlaceTotal = 0;

  for (const file of targetFiles) {
    const srcPath = path.join(imagesDir, file);
    if (!fs.existsSync(srcPath)) {
      console.warn(`File not found: ${file}`);
      continue;
    }

    const backupPath = path.join(backupDir, file);
    if (!fs.existsSync(backupPath)) {
      fs.copyFileSync(srcPath, backupPath);
    }

    const origStats = fs.statSync(backupPath);
    const origSize = origStats.size;
    originalTotal += origSize;

    const parsed = path.parse(file);
    const meta = await sharp(backupPath).metadata();

    // 1. Generate pristine high-quality WebP keeping 100% of the original dimensions
    const webpFilename = `${parsed.name}.webp`;
    const webpPath = path.join(imagesDir, webpFilename);

    const webpBuffer = await sharp(backupPath)
      .webp({
        quality: 86,
        effort: 6,
        smartSubsample: true,
      })
      .toBuffer();

    fs.writeFileSync(webpPath, webpBuffer);
    webpTotal += webpBuffer.length;

    // 2. Also optimize in-place fallback (.jpg or .png) keeping 100% dimensions
    let fallbackBuffer;
    if (parsed.ext.toLowerCase() === '.png') {
      fallbackBuffer = await sharp(backupPath)
        .png({
          quality: 90,
          compressionLevel: 9,
          palette: false,
        })
        .toBuffer();
    } else {
      fallbackBuffer = await sharp(backupPath)
        .jpeg({
          quality: 86,
          mozjpeg: true,
          chromaSubsampling: '4:4:4',
        })
        .toBuffer();
    }

    fs.writeFileSync(srcPath, fallbackBuffer);
    inPlaceTotal += fallbackBuffer.length;

    const webpSavings = ((1 - webpBuffer.length / origSize) * 100).toFixed(1);
    const fallbackSavings = ((1 - fallbackBuffer.length / origSize) * 100).toFixed(1);

    console.log(`📸 ${file} (${meta.width}x${meta.height})`);
    console.log(`   - Original:      ${(origSize / 1024).toFixed(0)} KB`);
    console.log(`   - WebP (q86):    ${(webpBuffer.length / 1024).toFixed(0)} KB (${webpSavings}% saved)`);
    console.log(`   - Optimized ${parsed.ext}: ${(fallbackBuffer.length / 1024).toFixed(0)} KB (${fallbackSavings}% saved)\n`);
  }

  console.log('==============================================');
  console.log(`📦 Original Total:          ${(originalTotal / 1024 / 1024).toFixed(2)} MB`);
  console.log(`✨ Optimized WebP Total:    ${(webpTotal / 1024 / 1024).toFixed(2)} MB (${((1 - webpTotal / originalTotal) * 100).toFixed(1)}% total saved)`);
  console.log(`⚡ Optimized Fallback Total: ${(inPlaceTotal / 1024 / 1024).toFixed(2)} MB (${((1 - inPlaceTotal / originalTotal) * 100).toFixed(1)}% total saved)`);
  console.log('==============================================');
}

optimizeImages().catch((err) => {
  console.error('Optimization failed:', err);
  process.exit(1);
});
