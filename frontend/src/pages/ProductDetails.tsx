import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { productService } from '../services/productService';
import { cartService } from '../services/cartService';
import { useAuth } from '../hooks/useAuth';
import Loader from '../components/Loader';
import type { Product } from '../types/product.types';

export default function ProductDetails() {
    const { id } = useParams<{ id: string }>();
    const { isAuthenticated } = useAuth();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [added, setAdded] = useState(false);
    const [cartError, setCartError] = useState('');

    useEffect(() => {
        if (!id) return;
        productService
            .getById(Number(id))
            .then(setProduct)
            .catch(() => setError('Product not found'))
            .finally(() => setLoading(false));
    }, [id]);

    const handleAddToCart = async () => {
        if (!product) return;
        if (!isAuthenticated) {
            setCartError('Please log in to add items to your cart');
            return;
        }
        setCartError('');
        try {
            await cartService.addToCart(product.id, 1);
            setAdded(true);
            setTimeout(() => setAdded(false), 2000);
        } catch (err: any) {
            setCartError(err.response?.data?.message || 'Failed to add to cart');
        }
    };

    if (loading) return <Loader />;
    if (error) return <p className="text-red-500">{error}</p>;
    if (!product) return null;

    const outOfStock = product.stock <= 0;
    const hasDiscount = product.discountPrice != null && product.discountPrice < product.price;

    return (
        <div className="max-w-4xl mx-auto">
            <Link to="/products" className="text-blue-600 text-sm hover:underline">
                &larr; Back to Products
            </Link>

            <div className="bg-white rounded shadow p-6 mt-4 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <img
                        src={product.imageUrl || 'https://via.placeholder.com/400'}
                        alt={product.name}
                        className="w-full h-80 object-cover rounded"
                    />
                    {product.images.length > 0 && (
                        <div className="flex gap-2 mt-3">
                            {product.images.map((img) => (
                                <img
                                    key={img.id}
                                    src={img.imageUrl}
                                    alt=""
                                    className="w-16 h-16 object-cover rounded border"
                                />
                            ))}
                        </div>
                    )}
                </div>

                <div>
                    <p className="text-sm text-gray-400">{product.category?.name}</p>
                    <h1 className="text-2xl font-bold mt-1">{product.name}</h1>
                    {product.brand && (
                        <p className="text-sm text-gray-500 mt-1">Brand: {product.brand}</p>
                    )}

                    <div className="flex items-center gap-1 text-sm text-yellow-500 mt-2">
                        <span>⭐</span>
                        <span className="text-gray-600">{product.averageRating.toFixed(1)}</span>
                    </div>

                    <p className="text-gray-700 mt-4">{product.description}</p>

                    <div className="mt-4 flex items-center gap-3">
                        {hasDiscount ? (
                            <>
                <span className="text-2xl font-bold text-blue-600">
                  ₹{product.discountPrice}
                </span>
                                <span className="text-lg text-gray-400 line-through">
                  ₹{product.price}
                </span>
                            </>
                        ) : (
                            <span className="text-2xl font-bold text-blue-600">₹{product.price}</span>
                        )}
                    </div>

                    <p className={`mt-2 text-sm ${outOfStock ? 'text-red-500' : 'text-green-600'}`}>
                        {outOfStock ? 'Out of stock' : `Available: ${product.stock}`}
                    </p>

                    <p className="text-sm text-gray-500 mt-1">
                        Sold by: {product.seller?.name}
                    </p>

                    {cartError && <p className="text-red-500 text-sm mt-3">{cartError}</p>}

                    <button
                        onClick={handleAddToCart}
                        disabled={outOfStock}
                        className="mt-4 w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                        {added ? 'Added to Cart!' : outOfStock ? 'Out of Stock' : 'Add to Cart'}
                    </button>
                </div>
            </div>
        </div>
    );
}
