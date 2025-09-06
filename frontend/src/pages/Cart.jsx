import { useEffect, useState } from 'react';
import { getCart, updateQty, removeFromCart } from '../lib/cart';

export default function Cart() {
  const [items, setItems] = useState(getCart());
  const subtotal = items.reduce((s, it) => s + it.price * it.qty, 0);

  useEffect(() => {
    const onUpd = () => setItems(getCart());
    window.addEventListener('cart:updated', onUpd);
    return () => window.removeEventListener('cart:updated', onUpd);
  }, []);

  if (!items.length) return <div className="max-w-4xl mx-auto p-6">Your cart is empty.</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Your Cart</h1>
      <div className="space-y-4">
        {items.map(it => (
          <div key={it.itemId} className="card flex items-center gap-4">
            <img src={it.imageUrl} alt="" className="w-24 h-24 object-cover rounded" />
            <div className="flex-1">
              <div className="font-medium">{it.title}</div>
              <div className="text-sm text-gray-600">₹{it.price}</div>
            </div>
            <div className="flex items-center gap-2">
              <button className="btn" onClick={() => { updateQty(it.itemId, it.qty - 1); setItems(getCart()); }}>–</button>
              <input className="w-14 border rounded px-2 py-1 text-center" value={it.qty}
                     onChange={e => { updateQty(it.itemId, Number(e.target.value) || 1); setItems(getCart()); }} />
              <button className="btn" onClick={() => { updateQty(it.itemId, it.qty + 1); setItems(getCart()); }}>+</button>
            </div>
            <div className="w-24 text-right font-medium">₹{(it.price * it.qty).toFixed(2)}</div>
            <button className="btn" onClick={() => { removeFromCart(it.itemId); setItems(getCart()); }}>Remove</button>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <div className="text-lg font-semibold">Subtotal</div>
        <div className="text-2xl font-bold">₹{subtotal.toFixed(2)}</div>
      </div>
    </div>
  );
}
