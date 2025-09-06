import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import { saveAuth } from '../lib/auth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const navigate = useNavigate();

  async function onSubmit(e) {
    e.preventDefault();
    setErr('');
    try {
      const res = await api.post('/auth/login', { email, password });
      // backend should return { token, user }
      saveAuth(res.data);
      navigate('/');
    } catch (e) {
      setErr(e?.response?.data?.error || 'Login failed');
    }
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Login</h1>
      {err && <div className="bg-red-50 border border-red-200 text-red-700 p-3 mb-3 rounded">{err}</div>}
      <form onSubmit={onSubmit} className="space-y-3">
        <input className="w-full border rounded px-3 py-2" placeholder="Email"
               value={email} onChange={(e)=>setEmail(e.target.value)} />
        <input className="w-full border rounded px-3 py-2" placeholder="Password" type="password"
               value={password} onChange={(e)=>setPassword(e.target.value)} />
        <button className="btn bg-black text-white w-full" type="submit">Login</button>
      </form>
      <p className="mt-3 text-sm">No account? <Link className="underline" to="/signup">Sign up</Link></p>
    </div>
  );
}
