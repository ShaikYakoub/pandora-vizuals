import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const imagesDir = path.join(process.cwd(), 'public', 'images');
const backupDir = path.join(imagesDir, 'backup_raw');

if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
}

async function optimizeImages() {
  console.log('🚀 Starting comprehensive upright, responsive image optimization...\n');

  const allFiles = fs.readdirSync(imagesDir);
  const targetFiles = allFiles.filter((file) => {
    const ext = path.extname(file).toLowerCase();
    const isImage = ext === '.jpg' || ext === '.jpeg' || ext === '.png';
    const isLogo = file.includes('logo') || file.includes('techmecs');
    return isImage && !isLogo;
  });

  console.log(`Found ${targetFiles.length} images to optimize.\n`);

  let originalTotal = 0;
  let webpTotal = 0;
  let fallbackTotal = 0;
  let processedCount = 0;

  for (const file of targetFiles) {
    const backupPath = path.join(backupDir, file);
    const srcPath = path.join(imagesDir, file);

    // 1. Ensure raw original is preserved in backup_raw
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
    const isBg = file.includes('footer-bg') || file.includes('hero');
    const maxDim = isBg ? 1920 : 1600;

    // 2. Generate crisp, auto-rotated, properly proportioned WebP
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
        quality: 82,
        effort: 6,
        smartSubsample: true,
      })
      .toBuffer();

    fs.writeFileSync(webpPath, webpBuffer);
    webpTotal += webpBuffer.length;

    // 3. Generate matching upright, resized lightweight fallback (.jpg or .png)
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
          palette: true,
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
          quality: 82,
          mozjpeg: true,
          chromaSubsampling: '4:4:4',
        })
        .toBuffer();
    }

    fs.writeFileSync(srcPath, fallbackBuffer);
    fallbackTotal += fallbackBuffer.length;
    processedCount++;

    const finalMeta = await sharp(webpBuffer).metadata();
    const webpSavings = ((1 - webpBuffer.length / origSize) * 100).toFixed(1);

    console.log(
      `[${processedCount}/${targetFiles.length}] 📸 ${file} ➔ ${webpFilename} (${finalMeta.width}x${finalMeta.height})`
    );
    console.log(`   - Original:  ${(origSize / 1024).toFixed(0)} KB`);
    console.log(`   - WebP:      ${(webpBuffer.length / 1024).toFixed(0)} KB (${webpSavings}% saved)`);
    console.log(`   - Fallback:  ${(fallbackBuffer.length / 1024).toFixed(0)} KB\n`);
  }

  const overallWebpSavings = ((1 - webpTotal / originalTotal) * 100).toFixed(1);
  const overallFallbackSavings = ((1 - fallbackTotal / originalTotal) * 100).toFixed(1);

  console.log('====================================================');
  console.log(`📦 Original Total:          ${(originalTotal / 1024 / 1024).toFixed(2)} MB`);
  console.log(`✨ Optimized WebP Total:    ${(webpTotal / 1024 / 1024).toFixed(2)} MB (${overallWebpSavings}% saved)`);
  console.log(`⚡ Optimized Fallback Total: ${(fallbackTotal / 1024 / 1024).toFixed(2)} MB (${overallFallbackSavings}% saved)`);
  console.log(`🎉 Successfully optimized ${processedCount} images!`);
  console.log('====================================================');
}

optimizeImages().catch((err) => {
  console.error('Optimization failed:', err);
  process.exit(1);
});
