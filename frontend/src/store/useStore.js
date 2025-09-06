import { useEffect, useState } from 'react';
import { api, setAuthToken, getToken } from '../lib/api';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    const token = getToken();
    if (token) setAuthToken(token);
    setLoading(false);
  }, []);

  const login = async (email, password, guestCart=[])=>{
    const { data } = await api.post('/auth/login', { email, password });
    setAuthToken(data.token);
    setUser(data.user);
    if (guestCart.length) {
      const res = await api.post('/cart/merge', { items: guestCart.map(ci=>({ itemId: ci.item._id || ci.item, quantity: ci.quantity })) });
      setCart(res.data);
      localStorage.removeItem('guest_cart');
    } else {
      setCart(data.cart || []);
    }
  };

  const signup = async (name, email, password)=>{
    const { data } = await api.post('/auth/signup', { name, email, password });
    setAuthToken(data.token);
    setUser(data.user);
    const res = await api.get('/cart');
    setCart(res.data);
  };

  const logout = ()=>{ setUser(null); setCart([]); setAuthToken(null); };

  const fetchItems = async (params)=> (await api.get('/items', { params })).data;

  const getCart = async ()=>{
    if (!getToken()) {
      const g = JSON.parse(localStorage.getItem('guest_cart') || '[]');
      return g;
    }
    const { data } = await api.get('/cart');
    setCart(data); return data;
  };

  const addToCart = async (item, qty=1)=>{
    if (!getToken()) {
      const g = JSON.parse(localStorage.getItem('guest_cart') || '[]');
      const id = item._id || item;
      const idx = g.findIndex(ci => (ci.item._id || ci.item) === id);
      if (idx >= 0) g[idx].quantity += qty; else g.push({ item, quantity: qty });
      localStorage.setItem('guest_cart', JSON.stringify(g));
      setCart(g); return g;
    }
    const { data } = await api.post('/cart/add', { itemId: item._id || item, quantity: qty });
    setCart(data); return data;
  };

  const setQty = async (itemId, quantity)=>{
    if (!getToken()) {
      const g = JSON.parse(localStorage.getItem('guest_cart') || '[]');
      const idx = g.findIndex(ci => (ci.item._id || ci.item) === itemId);
      if (idx >= 0) { if (quantity <= 0) g.splice(idx,1); else g[idx].quantity = quantity; }
      localStorage.setItem('guest_cart', JSON.stringify(g));
      setCart(g); return g;
    }
    const { data } = await api.put('/cart/set', { itemId, quantity });
    setCart(data); return data;
  };

  const removeFromCart = async (itemId)=>{
    if (!getToken()) {
      const g = JSON.parse(localStorage.getItem('guest_cart') || '[]');
      const idx = g.findIndex(ci => (ci.item._id || ci.item) === itemId);
      if (idx >= 0) g.splice(idx,1);
      localStorage.setItem('guest_cart', JSON.stringify(g));
      setCart(g); return g;
    }
    const { data } = await api.delete('/cart/remove/' + itemId);
    setCart(data); return data;
  };

  return { user, cart, loading, login, signup, logout, fetchItems, getCart, addToCart, setQty, removeFromCart };
}
