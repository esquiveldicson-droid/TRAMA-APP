import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

async function generate() {
  const publicDir = path.resolve('public');
  const svgPath = path.join(publicDir, 'icon.svg');
  const svgBuffer = fs.readFileSync(svgPath);

  console.log('Generating 192x192 PNG icon...');
  await sharp(svgBuffer)
    .resize(192, 192)
    .png()
    .toFile(path.join(publicDir, 'icon-192.png'));

  console.log('Generating 512x512 PNG icon...');
  await sharp(svgBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'icon-512.png'));

  console.log('Generating maskable 512x512 PNG icon...');
  await sharp(svgBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'icon-maskable-512.png'));

  const mobileSvgPath = path.join(publicDir, 'screenshot-mobile.svg');
  if (fs.existsSync(mobileSvgPath)) {
    console.log('Generating mobile screenshot PNG...');
    await sharp(fs.readFileSync(mobileSvgPath))
      .resize(750, 1334)
      .png()
      .toFile(path.join(publicDir, 'screenshot-mobile.png'));
  }

  const desktopSvgPath = path.join(publicDir, 'screenshot-desktop.svg');
  if (fs.existsSync(desktopSvgPath)) {
    console.log('Generating desktop screenshot PNG...');
    await sharp(fs.readFileSync(desktopSvgPath))
      .resize(1280, 800)
      .png()
      .toFile(path.join(publicDir, 'screenshot-desktop.png'));
  }

  console.log('All PNG icons and screenshots generated successfully!');
}

generate().catch((err) => {
  console.error('Error generating icons:', err);
  process.exit(1);
});
