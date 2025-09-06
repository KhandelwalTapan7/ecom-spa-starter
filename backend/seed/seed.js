// backend/seed/seed.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Item from '../src/models/Item.js';

dotenv.config();

const items = [
  // ELECTRONICS
  {
    title: 'Wireless Headphones',
    description: 'Bluetooth over-ear, noise cancelling, 30h battery.',
    price: 2599,
    category: 'Electronics',
    imageUrl: '/images/headphones.svg',
  },
  {
    title: 'Smartwatch',
    description: 'Heart-rate, SpO₂, GPS and app notifications.',
    price: 4999,
    category: 'Electronics',
    imageUrl: '/images/smartwatch.svg',
  },
  {
    title: 'Bluetooth Speaker',
    description: 'Portable 10W speaker with deep bass, IPX5.',
    price: 1499,
    category: 'Electronics',
    imageUrl: '/images/bluetooth-speaker.svg',
  },
  {
    title: 'Gaming Mouse',
    description: 'Ergonomic, 6 buttons, 12,000 DPI optical sensor.',
    price: 1299,
    category: 'Electronics',
    imageUrl: '/images/gaming-mouse.svg',
  },
  {
    title: 'Power Bank 10000mAh',
    description: 'Dual USB output, fast charge, LED indicators.',
    price: 1299,
    category: 'Electronics',
    imageUrl: '/images/power-bank.svg',
  },

  // SPORTS
  {
    title: 'Running Shoes',
    description: 'Lightweight cushioning, breathable mesh upper.',
    price: 2999,
    category: 'Sports',
    imageUrl: '/images/running-shoes.svg',
  },
  {
    title: 'Yoga Mat',
    description: '6mm anti-skid mat for home workouts & yoga.',
    price: 699,
    category: 'Sports',
    imageUrl: '/images/yoga-mat.svg',
  },
  {
    title: 'Stainless Water Bottle 1L',
    description: 'Insulated, keeps drinks cold for 18h.',
    price: 499,
    category: 'Sports',
    imageUrl: '/images/water-bottle.svg',
  },

  // HOME
  {
    title: 'Coffee Maker',
    description: 'Drip brewer with reusable filter, 4-cup capacity.',
    price: 1799,
    category: 'Home',
    imageUrl: '/images/coffee-maker.svg',
  },
  {
    title: 'Electric Kettle',
    description: '1.7L auto shut-off, concealed heating element.',
    price: 899,
    category: 'Home',
    imageUrl: '/images/electric-kettle.svg',
  },
  {
    title: 'LED Desk Lamp',
    description: '3 color modes, touch dimmer, USB powered.',
    price: 1099,
    category: 'Home',
    imageUrl: '/images/desk-lamp.svg',
  },
  {
    title: 'Office Chair',
    description: 'Ergonomic mesh back with lumbar support.',
    price: 6499,
    category: 'Home',
    imageUrl: '/images/office-chair.svg',
  },
];

async function run() {
  try {
    if (!process.env.MONGO_URI) throw new Error('MONGO_URI is missing in .env');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const del = await Item.deleteMany({});
    console.log(`Cleared items: ${del.deletedCount}`);

    const inserted = await Item.insertMany(items);
    console.log(`Seeded ${inserted.length} items`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

run();
