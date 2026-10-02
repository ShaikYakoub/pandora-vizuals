const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const potrace = require('potrace');

const inputPath = 'C:/Users/Windows/.gemini/antigravity-ide/brain/74abd4ca-62be-4f14-8326-a367fecb30f2/.user_uploaded/media_1790948963375.png';
const publicDir = path.join(__dirname, '../public/images');
fs.mkdirSync(publicDir, { recursive: true });

async function processLogos() {
  console.log('Optimizing logo from:', inputPath);

  // 1. High precision vector trace with potrace
  const flattened = await sharp(inputPath)
    .flatten({ background: { r: 255, g: 255, b: 255 } })
    .toBuffer();

  const svg = await new Promise((resolve, reject) => {
    potrace.trace(
      flattened,
      {
        threshold: 128,
        optTolerance: 0.15,
        turnPolicy: potrace.Potrace.TURNPOLICY_MINORITY,
        turdSize: 2,
      },
      (err, result) => {
        if (err) reject(err);
        else resolve(result);
      }
    );
  });

  // Clean potrace output fill
  const svgClean = svg.replace(/fill="black"/g, '');
  const svgCurrentColor = svgClean.replace(/<path/g, '<path fill="currentColor"');
  fs.writeFileSync(path.join(publicDir, 'pandora-logo.svg'), svgCurrentColor);

  // Create White SVG
  const svgWhite = svgClean.replace(/<path/g, '<path fill="#ece8e1"');
  fs.writeFileSync(path.join(publicDir, 'pandora-logo-white.svg'), svgWhite);

  // Create Dark SVG
  const svgDark = svgClean.replace(/<path/g, '<path fill="#0c0c0b"');
  fs.writeFileSync(path.join(publicDir, 'pandora-logo-dark.svg'), svgDark);

  // 2. Generate optimized lossy and lossless WebP assets
  const { data, info } = await sharp(inputPath)
    .raw()
    .toBuffer({ resolveWithObject: true });

  // White RGB (#ece8e1) preserving original alpha
  const whiteData = Buffer.from(data);
  for (let i = 0; i < whiteData.length; i += 4) {
    whiteData[i] = 236;
    whiteData[i + 1] = 232;
    whiteData[i + 2] = 225;
  }

  // Lossless WebP (sharp and crisp, ~15-20 KB)
  await sharp(whiteData, { raw: { width: info.width, height: info.height, channels: 4 } })
    .webp({ lossless: true })
    .toFile(path.join(publicDir, 'pandora-logo-white.webp'));

  await sharp(inputPath)
    .webp({ lossless: true })
    .toFile(path.join(publicDir, 'pandora-logo-dark.webp'));

  // Also lightweight compressed WebP (5-8 KB for instant sub-millisecond network load)
  await sharp(whiteData, { raw: { width: info.width, height: info.height, channels: 4 } })
    .webp({ quality: 85, effort: 6 })
    .toFile(path.join(publicDir, 'pandora-logo-white-compressed.webp'));

  await sharp(inputPath)
    .webp({ quality: 85, effort: 6 })
    .toFile(path.join(publicDir, 'pandora-logo-dark-compressed.webp'));

  console.log('--- Results ---');
  console.log('SVG (currentColor):', fs.statSync(path.join(publicDir, 'pandora-logo.svg')).size, 'bytes');
  console.log('SVG (White):', fs.statSync(path.join(publicDir, 'pandora-logo-white.svg')).size, 'bytes');
  console.log('SVG (Dark):', fs.statSync(path.join(publicDir, 'pandora-logo-dark.svg')).size, 'bytes');
  console.log('White WebP (Lossless):', fs.statSync(path.join(publicDir, 'pandora-logo-white.webp')).size, 'bytes');
  console.log('Dark WebP (Lossless):', fs.statSync(path.join(publicDir, 'pandora-logo-dark.webp')).size, 'bytes');
  console.log('White WebP (Compressed):', fs.statSync(path.join(publicDir, 'pandora-logo-white-compressed.webp')).size, 'bytes');
  console.log('Dark WebP (Compressed):', fs.statSync(path.join(publicDir, 'pandora-logo-dark-compressed.webp')).size, 'bytes');
}

processLogos().catch(console.error);
