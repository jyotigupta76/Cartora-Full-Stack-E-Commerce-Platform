import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { productService } from '../services/productService';
import type { Product } from '../types/product.types';

export default function SellerProducts() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const loadProducts = () => {
        setLoading(true);
        productService
            .getMyProducts()
            .then((data) => setProducts(data.content))
            .catch(() => setError('Failed to load your products'))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        loadProducts();
    }, []);

    const handleDelete = async (id: number) => {
        if (!confirm('Delete this product?')) return;
        try {
            await productService.delete(id);
            loadProducts();
        } catch {
            alert('Failed to delete product');
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">My Products</h1>
                <Link
                    to="/seller/products/new"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    + Add Product
                </Link>
            </div>

            {loading && <p>Loading...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {!loading && products.length === 0 && <p>You haven't listed any products yet.</p>}

            <div className="bg-white rounded shadow overflow-hidden">
                {products.map((product) => (
                    <div
                        key={product.id}
                        className="flex items-center justify-between p-4 border-b last:border-b-0"
                    >
                        <div className="flex items-center gap-3">
                            <img
                                src={product.imageUrl || 'https://via.placeholder.com/60'}
                                alt={product.name}
                                className="w-14 h-14 object-cover rounded"
                            />
                            <div>
                                <p className="font-semibold">{product.name}</p>
                                <p className="text-sm text-gray-500">
                                    ₹{product.price} &middot; Stock: {product.stock}
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Link
                                to={`/seller/products/${product.id}/edit`}
                                className="text-sm text-blue-600 hover:underline"
                            >
                                Edit
                            </Link>
                            <button
                                onClick={() => handleDelete(product.id)}
                                className="text-sm text-red-500 hover:underline"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
