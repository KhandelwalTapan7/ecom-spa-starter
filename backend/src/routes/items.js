import express from 'express';
import { body, validationResult } from 'express-validator';
import Item from '../models/Item.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.post('/',
  requireAuth,
  body('title').isLength({min:2}),
  body('price').isFloat({min:0}),
async (req, res)=>{
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const item = await Item.create(req.body);
  res.status(201).json(item);
});

router.get('/', async (req, res)=>{
  const { search, category, minPrice, maxPrice } = req.query;
  const q = {};
  if (category) q.category = category;
  if (minPrice || maxPrice) q.price = {};
  if (minPrice) q.price.$gte = Number(minPrice);
  if (maxPrice) q.price.$lte = Number(maxPrice);

  let query = Item.find(q).sort({ createdAt: -1 });
  if (search) query = query.find({ $text: { $search: search } });
  const items = await query.exec();
  res.json(items);
});

router.get('/:id', async (req, res)=>{
  const item = await Item.findById(req.params.id);
  if (!item) return res.status(404).json({ error: 'Not found' });
  res.json(item);
});

router.put('/:id', requireAuth, async (req, res)=>{
  const item = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!item) return res.status(404).json({ error: 'Not found' });
  res.json(item);
});

router.delete('/:id', requireAuth, async (req, res)=>{
  await Item.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

export default router;
