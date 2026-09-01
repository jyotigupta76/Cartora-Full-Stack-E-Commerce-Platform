import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function MainLayout() {
    const { isLoggedIn, name, role, logout } = useAuth();

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow px-6 py-4 flex items-center justify-between">
                <Link to="/" className="text-xl font-bold text-blue-600">
                    E-Commerce
                </Link>
                <div className="flex items-center gap-4">
                    <Link to="/products" className="text-gray-700 hover:text-blue-600">
                        Products
                    </Link>
                    {isLoggedIn ? (
                        <>
              <span className="text-sm text-gray-500">
                {name} ({role})
              </span>
                            <button
                                onClick={logout}
                                className="text-sm text-red-500 hover:underline"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="text-gray-700 hover:text-blue-600">
                                Login
                            </Link>
                            <Link to="/register" className="text-gray-700 hover:text-blue-600">
                                Register
                            </Link>
                        </>
                    )}
                </div>
            </nav>
            <main className="p-6">
                <Outlet />
            </main>
        </div>
    );
}
