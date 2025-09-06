import mongoose from 'mongoose';

const CartItemSchema = new mongoose.Schema({
  item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
  quantity: { type: Number, default: 1, min: 1 }
}, { _id: false });

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  passwordHash: { type: String, required: true },
  cart: { type: [CartItemSchema], default: [] }
}, { timestamps: true });

export default mongoose.model('User', UserSchema);
