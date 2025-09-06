import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [authed, setAuthed] = useState(!!localStorage.getItem("token"));
  const [cartCount, setCartCount] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();

  const readCart = () => {
    try {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      setCartCount(cart.reduce((n, i) => n + (i.qty || 1), 0));
    } catch {
      setCartCount(0);
    }
  };

  useEffect(() => {
    readCart();
    setAuthed(!!localStorage.getItem("token"));
  }, [location]);

  const logout = () => {
    localStorage.removeItem("token");
    setAuthed(false);
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="font-semibold text-xl">ShopLite</Link>

        <nav className="flex items-center gap-3">
          <Link to="/" className="px-3 py-1.5 rounded hover:bg-gray-100">Home</Link>

          <Link to="/cart" className="px-3 py-1.5 rounded hover:bg-gray-100">
            Cart
            <span className="ml-1 inline-flex items-center justify-center text-xs font-medium rounded-full px-1.5 py-0.5 bg-black text-white">
              {cartCount}
            </span>
          </Link>

          {!authed ? (
            <>
              <Link to="/login" className="px-3 py-1.5 rounded border">Login</Link>
              <Link to="/signup" className="px-3 py-1.5 rounded bg-black text-white">Sign up</Link>
            </>
          ) : (
            <button onClick={logout} className="px-3 py-1.5 rounded border">Logout</button>
          )}
        </nav>
      </div>
    </header>
  );
}
