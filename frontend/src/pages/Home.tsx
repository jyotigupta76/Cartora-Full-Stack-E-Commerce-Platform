import { Link } from 'react-router-dom';

export default function Home() {
    return (
        <div className="text-center py-20">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
                Welcome to the E-Commerce Store
            </h1>
            <p className="text-gray-500 mb-8">
                Browse products from multiple sellers, all in one place.
            </p>
            <Link
                to="/products"
                className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
            >
                Browse Products
            </Link>
        </div>
    );
}
