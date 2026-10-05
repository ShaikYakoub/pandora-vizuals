const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const potrace = require('potrace');

const publicDir = path.join(__dirname, '../public/images');
const darkInput = path.join(publicDir, 'PANDORA LOGO UPDATED.png');
const whiteInput = path.join(publicDir, 'PANDORA LOGO UPDATED WHITE copy.png');

async function processLogos() {
  console.log('Processing new logos:');
  console.log('- Dark input:', darkInput);
  console.log('- White input:', whiteInput);

  // 1. Trim dark image to get exact bounding box and flatten to white background for potrace
  const trimmedDarkBuffer = await sharp(darkInput)
    .trim()
    .flatten({ background: { r: 255, g: 255, b: 255 } })
    .toBuffer();

  // 2. High precision vector trace with potrace
  const svg = await new Promise((resolve, reject) => {
    potrace.trace(
      trimmedDarkBuffer,
      {
        threshold: 128,
        optTolerance: 0.1,
        turdSize: 2,
        optCurve: true,
        turnPolicy: potrace.Potrace.TURNPOLICY_MINORITY,
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

  console.log('SVGs generated successfully.');

  // 3. Trim PNG inputs
  const trimmedWhite = await sharp(whiteInput).trim().toBuffer();
  const trimmedDark = await sharp(darkInput).trim().toBuffer();

  // Optimized Master PNGs
  await sharp(trimmedWhite)
    .png({ compressionLevel: 9 })
    .toFile(path.join(publicDir, 'pandora-logo-white.png'));

  await sharp(trimmedDark)
    .png({ compressionLevel: 9 })
    .toFile(path.join(publicDir, 'pandora-logo-dark.png'));

  // Lossless WebP (master resolution 4135px, pristine crispness)
  await sharp(trimmedWhite)
    .webp({ lossless: true })
    .toFile(path.join(publicDir, 'pandora-logo-white.webp'));

  await sharp(trimmedDark)
    .webp({ lossless: true })
    .toFile(path.join(publicDir, 'pandora-logo-dark.webp'));

  // Compressed WebP (capped at max 2560px for hyper-fast web delivery, ~15-25 KB)
  await sharp(trimmedWhite)
    .resize(2560, null, { withoutEnlargement: true })
    .webp({ quality: 85, effort: 6 })
    .toFile(path.join(publicDir, 'pandora-logo-white-compressed.webp'));

  await sharp(trimmedDark)
    .resize(2560, null, { withoutEnlargement: true })
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
  console.log('White PNG (Optimized):', fs.statSync(path.join(publicDir, 'pandora-logo-white.png')).size, 'bytes');
  console.log('Dark PNG (Optimized):', fs.statSync(path.join(publicDir, 'pandora-logo-dark.png')).size, 'bytes');
}

processLogos().catch(console.error);
