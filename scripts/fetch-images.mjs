// scripts/fetch-images.mjs
// Downloads product photos into frontend/public/images using the Pexels API.
// Node 18+ (global fetch). Set PEXELS_API_KEY in your shell before running.

import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const API_KEY = process.env.PEXELS_API_KEY;
if (!API_KEY) {
  console.error('Missing PEXELS_API_KEY env var. Get one free at https://www.pexels.com/api/');
  process.exit(1);
}

const outDir = resolve('frontend/public/images');

const products = [
  ['headphones.jpg',        'headphones product isolated white background'],
  ['smartwatch.jpg',        'smartwatch product isolated white background'],
  ['bluetooth-speaker.jpg', 'bluetooth speaker product isolated white background'],
  ['gaming-mouse.jpg',      'gaming mouse product isolated white background'],
  ['power-bank.jpg',        'power bank portable charger product isolated white background'],
  ['running-shoes.jpg',     'running shoes sneakers isolated white background'],
  ['yoga-mat.jpg',          'yoga mat isolated white background'],
  ['water-bottle.jpg',      'stainless steel water bottle isolated white background'],
  ['coffee-maker.jpg',      'drip coffee maker machine isolated white background'],
  ['electric-kettle.jpg',   'electric kettle isolated white background'],
  ['desk-lamp.jpg',         'desk lamp led isolated white background'],
  ['office-chair.jpg',      'office chair ergonomic isolated white background'],
];

async function pexelsSearch(query) {
  const url = new URL('https://api.pexels.com/v1/search');
  url.search = new URLSearchParams({ query, per_page: '1', orientation: 'landscape', size: 'large' });
  const res = await fetch(url, { headers: { Authorization: API_KEY } });
  if (!res.ok) throw new Error(`Pexels search ${res.status}`);
  const data = await res.json();
  if (!data.photos?.length) throw new Error('No results');
  return data.photos[0].src.large2x || data.photos[0].src.large || data.photos[0].src.original;
}

async function fetchToFile(url, dest) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`download ${r.status}`);
  const buf = Buffer.from(await r.arrayBuffer());
  await writeFile(dest, buf);
}

await mkdir(outDir, { recursive: true });

for (const [filename, query] of products) {
  const dest = resolve(outDir, filename);
  try {
    console.log('Downloading', filename, '→', query);
    const imgUrl = await pexelsSearch(query);
    await fetchToFile(imgUrl, dest);
    console.log('✔ Saved', filename);
  } catch (e) {
    console.warn('⚠ Could not fetch', filename, '→', e.message, '— leaving any existing file as-is.');
  }
}

console.log('Done. Files in', outDir);
