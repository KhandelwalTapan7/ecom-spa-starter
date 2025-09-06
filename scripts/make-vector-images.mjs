// scripts/make-vector-images.mjs
// Creates local SVG images for each product into frontend/public/images (no internet needed).
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const outDir = resolve('frontend/public/images');

const svg = (w, h, body) => `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#f7f7f7"/><stop offset="100%" stop-color="#e8e8e8"/>
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#bg)"/>
  ${body}
</svg>`;

const iconColor = '#111';
const accent = '#0ea5e9';
const W = 1200, H = 800, CX = W/2, CY = H/2;

const files = {
  'headphones.svg': svg(W, H, `
    <path d="M300,430 a300,300 0 0 1 600,0" fill="none" stroke="${iconColor}" stroke-width="40"/>
    <rect x="220" y="430" rx="30" ry="30" width="180" height="220" fill="${iconColor}"/>
    <rect x="800" y="430" rx="30" ry="30" width="180" height="220" fill="${iconColor}"/>
  `),

  'smartwatch.svg': svg(W, H, `
    <rect x="${CX-140}" y="${CY-180}" width="280" height="360" rx="40" fill="${iconColor}"/>
    <rect x="${CX-110}" y="${CY-150}" width="220" height="300" rx="30" fill="white"/>
    <rect x="${CX-260}" y="${CY-240}" width="120" height="480" rx="30" fill="${accent}" opacity="0.6"/>
    <rect x="${CX+140}" y="${CY-240}" width="120" height="480" rx="30" fill="${accent}" opacity="0.6"/>
  `),

  'bluetooth-speaker.svg': svg(W, H, `
    <rect x="${CX-250}" y="${CY-180}" width="500" height="360" rx="30" fill="${iconColor}"/>
    <circle cx="${CX-120}" cy="${CY}" r="90" fill="${accent}"/>
    <circle cx="${CX+120}" cy="${CY}" r="90" fill="${accent}"/>
  `),

  'gaming-mouse.svg': svg(W, H, `
    <path d="M${CX},${CY-220} c140,0 220,110 220,240 0,130-100,210-220,210 -120,0-220-80-220-210 0-130 80-240 220-240z" fill="${iconColor}"/>
    <rect x="${CX-20}" y="${CY-170}" width="40" height="120" rx="20" fill="white"/>
  `),

  'power-bank.svg': svg(W, H, `
    <rect x="${CX-220}" y="${CY-160}" width="440" height="320" rx="30" fill="${iconColor}"/>
    <polygon points="${CX-20},${CY-110} ${CX+60},${CY-110} ${CX+10},${CY} ${CX+60},${CY} ${CX-60},${CY+110} ${CX-10},${CY} ${CX-60},${CY}" fill="${accent}"/>
  `),

  'running-shoes.svg': svg(W, H, `
    <path d="M300,560 L900,560 900,520 760,480 720,440 520,460 460,500 300,520z" fill="${iconColor}"/>
    <rect x="540" y="480" width="60" height="20" fill="white"/><rect x="600" y="470" width="60" height="20" fill="white"/>
    <rect x="660" y="460" width="60" height="20" fill="white"/><rect x="720" y="450" width="60" height="20" fill="white"/>
  `),

  'yoga-mat.svg': svg(W, H, `
    <rect x="260" y="${CY-40}" width="680" height="80" rx="40" fill="${iconColor}"/>
    <circle cx="980" cy="${CY}" r="80" fill="${iconColor}"/>
    <circle cx="980" cy="${CY}" r="45" fill="white"/>
  `),

  'water-bottle.svg': svg(W, H, `
    <rect x="${CX-90}" y="${CY-230}" width="180" height="420" rx="40" fill="${iconColor}"/>
    <rect x="${CX-60}" y="${CY-300}" width="120" height="80" rx="20" fill="${iconColor}"/>
    <rect x="${CX-50}" y="${CY-330}" width="100" height="40" rx="10" fill="${accent}"/>
  `),

  'coffee-maker.svg': svg(W, H, `
    <rect x="${CX-260}" y="${CY-180}" width="520" height="340" rx="20" fill="${iconColor}"/>
    <rect x="${CX-120}" y="${CY+40}" width="240" height="140" rx="20" fill="white"/>
    <rect x="${CX-220}" y="${CY-140}" width="440" height="60" rx="10" fill="${accent}"/>
  `),

  'electric-kettle.svg': svg(W, H, `
    <path d="M${CX-200},${CY+200} L${CX+200},${CY+200} L${CX+160},${CY-80} Q${CX},${CY-180} ${CX-160},${CY-80} Z" fill="${iconColor}"/>
    <rect x="${CX+200}" y="${CY-40}" width="100" height="120" rx="20" fill="${accent}"/>
  `),

  'desk-lamp.svg': svg(W, H, `
    <rect x="${CX-260}" y="${CY+120}" width="520" height="40" rx="10" fill="${iconColor}"/>
    <line x1="${CX-120}" y1="${CY+120}" x2="${CX}" y2="${CY}" stroke="${iconColor}" stroke-width="20"/>
    <line x1="${CX}" y1="${CY}" x2="${CX+140}" y2="${CY-120}" stroke="${iconColor}" stroke-width="20"/>
    <circle cx="${CX+160}" cy="${CY-140}" r="60" fill="${accent}"/>
  `),

  'office-chair.svg': svg(W, H, `
    <rect x="${CX-160}" y="${CY-120}" width="320" height="220" rx="40" fill="${iconColor}"/>
    <rect x="${CX-100}" y="${CY+100}" width="200" height="40" rx="10" fill="${iconColor}"/>
    <line x1="${CX-60}" y1="${CY+140}" x2="${CX-140}" y2="${CY+220}" stroke="${iconColor}" stroke-width="20"/>
    <line x1="${CX+60}" y1="${CY+140}" x2="${CX+140}" y2="${CY+220}" stroke="${iconColor}" stroke-width="20"/>
  `),
};

async function run() {
  await mkdir(outDir, { recursive: true });
  for (const [name, content] of Object.entries(files)) {
    await writeFile(resolve(outDir, name), content, 'utf8');
    console.log('✔ wrote', name);
  }
  console.log('Images created in', outDir);
}
run().catch(err => { console.error(err); process.exit(1); });
