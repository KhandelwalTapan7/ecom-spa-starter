import mongoose from 'mongoose';

const ItemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  price: { type: Number, required: true, min: 0 },
  category: { type: String, index: true },
  imageUrl: { type: String, default: '' },
  stock: { type: Number, default: 100, min: 0 }
}, { timestamps: true });

ItemSchema.index({ title: 'text', description: 'text', category: 'text' });
export default mongoose.model('Item', ItemSchema);
