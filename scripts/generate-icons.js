import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// 1. Standard icon SVG (for desktop & general display)
const standardSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <radialGradient id="bgGrad" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#0a1254" />
      <stop offset="85%" stop-color="#020024" />
      <stop offset="100%" stop-color="#010014" />
    </radialGradient>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fef08a" />
      <stop offset="35%" stop-color="#f59e0b" />
      <stop offset="70%" stop-color="#d97706" />
      <stop offset="100%" stop-color="#b45309" />
    </linearGradient>
    <linearGradient id="innerGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#1e1b4b" />
      <stop offset="100%" stop-color="#090a2b" />
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="8" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <!-- Background -->
  <rect width="512" height="512" rx="100" fill="url(#bgGrad)" />

  <!-- Outer Star Ring / Points for Who Wants to Be a Millionaire aesthetic -->
  <circle cx="256" cy="256" r="215" fill="none" stroke="url(#goldGrad)" stroke-width="4" opacity="0.6" />
  <circle cx="256" cy="256" r="200" fill="none" stroke="url(#goldGrad)" stroke-width="8" />
  <circle cx="256" cy="256" r="185" fill="url(#innerGrad)" stroke="#3b82f6" stroke-width="3" />

  <!-- Graph / Asymptote Grid subtle background -->
  <path d="M 120 256 H 392" stroke="#3b82f6" stroke-width="2" stroke-dasharray="4,4" opacity="0.4" />
  <path d="M 256 120 V 392" stroke="#3b82f6" stroke-width="2" stroke-dasharray="4,4" opacity="0.4" />

  <!-- Mathematical Hyperbola / Asymptote Curve -->
  <path d="M 160 160 Q 240 240 240 360" fill="none" stroke="#60a5fa" stroke-width="4" opacity="0.5" />
  <path d="M 272 152 Q 272 272 352 352" fill="none" stroke="#60a5fa" stroke-width="4" opacity="0.5" />

  <!-- Inner Gold Medallion -->
  <circle cx="256" cy="256" r="140" fill="none" stroke="url(#goldGrad)" stroke-width="6" filter="url(#glow)" />
  <circle cx="256" cy="256" r="128" fill="#020024" fill-opacity="0.8" />

  <!-- TP Monogram + Math 12 -->
  <text x="256" y="272" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="104" fill="url(#goldGrad)" text-anchor="middle" letter-spacing="-3">TP</text>
  <text x="256" y="328" font-family="system-ui, -apple-system, sans-serif" font-weight="800" font-size="28" fill="#93c5fd" text-anchor="middle" letter-spacing="4">TOÁN 12</text>

  <!-- Sparkles -->
  <polygon points="256,92 262,106 276,112 262,118 256,132 250,118 236,112 250,106" fill="#fde047" />
  <polygon points="380,240 384,249 393,253 384,257 380,266 376,257 367,253 376,249" fill="#fde047" />
</svg>`;

// 2. Maskable icon SVG (needs 15-20% safe zone padding for Android circular cropping)
const maskableSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <radialGradient id="bgGradM" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#0a1254" />
      <stop offset="70%" stop-color="#020024" />
      <stop offset="100%" stop-color="#010014" />
    </radialGradient>
    <linearGradient id="goldGradM" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fef08a" />
      <stop offset="35%" stop-color="#f59e0b" />
      <stop offset="70%" stop-color="#d97706" />
      <stop offset="100%" stop-color="#b45309" />
    </linearGradient>
    <linearGradient id="innerGradM" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#1e1b4b" />
      <stop offset="100%" stop-color="#090a2b" />
    </linearGradient>
  </defs>

  <!-- Full-bleed background -->
  <rect width="512" height="512" fill="url(#bgGradM)" />

  <!-- Scaled down 75% inside safe zone -->
  <g transform="translate(64, 64) scale(0.75)">
    <circle cx="256" cy="256" r="215" fill="none" stroke="url(#goldGradM)" stroke-width="4" opacity="0.6" />
    <circle cx="256" cy="256" r="200" fill="none" stroke="url(#goldGradM)" stroke-width="10" />
    <circle cx="256" cy="256" r="185" fill="url(#innerGradM)" stroke="#3b82f6" stroke-width="4" />

    <circle cx="256" cy="256" r="140" fill="none" stroke="url(#goldGradM)" stroke-width="8" />
    <circle cx="256" cy="256" r="128" fill="#020024" fill-opacity="0.85" />

    <text x="256" y="272" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="112" fill="url(#goldGradM)" text-anchor="middle" letter-spacing="-3">TP</text>
    <text x="256" y="328" font-family="system-ui, -apple-system, sans-serif" font-weight="800" font-size="30" fill="#93c5fd" text-anchor="middle" letter-spacing="4">TOÁN 12</text>
    <polygon points="256,92 262,106 276,112 262,118 256,132 250,118 236,112 250,106" fill="#fde047" />
  </g>
</svg>`;

async function main() {
  fs.writeFileSync(path.join(publicDir, 'icon.svg'), standardSvg);
  console.log('Written icon.svg');

  // Convert standardSvg to PNG 192x192
  await sharp(Buffer.from(standardSvg))
    .resize(192, 192)
    .png()
    .toFile(path.join(publicDir, 'pwa-192x192.png'));
  console.log('Written pwa-192x192.png');

  // Convert standardSvg to PNG 512x512
  await sharp(Buffer.from(standardSvg))
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'pwa-512x512.png'));
  console.log('Written pwa-512x512.png');

  // Convert maskableSvg to PNG 512x512 (maskable)
  await sharp(Buffer.from(maskableSvg))
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'pwa-maskable-512x512.png'));
  console.log('Written pwa-maskable-512x512.png');

  // Apple touch icon 180x180
  await sharp(Buffer.from(standardSvg))
    .resize(180, 180)
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));
  console.log('Written apple-touch-icon.png');

  // Favicon 64x64 png
  await sharp(Buffer.from(standardSvg))
    .resize(64, 64)
    .png()
    .toFile(path.join(publicDir, 'favicon.png'));
  console.log('Written favicon.png');
}

main().catch(console.error);
