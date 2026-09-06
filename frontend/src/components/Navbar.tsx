import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { cartService } from '../services/cartService';

export default function Navbar() {
    const { isAuthenticated, name, role, logout } = useAuth();
    const [cartCount, setCartCount] = useState(0);

    useEffect(() => {
        if (!isAuthenticated) {
            setCartCount(0);
            return;
        }
        cartService
            .getCart()
            .then((items) => setCartCount(items.reduce((sum, i) => sum + i.quantity, 0)))
            .catch(() => setCartCount(0));
    }, [isAuthenticated]);

    return (
        <nav className="bg-brand-500 px-6 py-4 flex items-center justify-between shadow-md">
            <Link to="/" className="font-display text-2xl font-semibold text-white tracking-tight">
                Marketa
            </Link>
            <div className="flex items-center gap-5">
                <Link to="/" className="text-brand-100 hover:text-white transition-colors text-sm font-medium">
                    Home
                </Link>
                <Link to="/products" className="text-brand-100 hover:text-white transition-colors text-sm font-medium">
                    Products
                </Link>
                <Link to="/cart" className="relative text-brand-100 hover:text-white transition-colors text-sm font-medium">
                    Cart
                    {cartCount > 0 && (
                        <span className="absolute -top-2 -right-4 bg-amber-accent text-brand-900 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {cartCount}
            </span>
                    )}
                </Link>
                {isAuthenticated ? (
                    <>
            <span className="text-sm text-brand-100">
              {name} <span className="text-brand-300">({role})</span>
            </span>
                        <button
                            onClick={logout}
                            className="text-sm text-brand-100 hover:text-white transition-colors"
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="text-brand-100 hover:text-white transition-colors text-sm font-medium">
                            Login
                        </Link>
                        <Link
                            to="/register"
                            className="bg-amber-accent text-brand-900 px-4 py-1.5 rounded-full text-sm font-semibold hover:bg-amber-accent-dark transition-colors"
                        >
                            Register
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
}
