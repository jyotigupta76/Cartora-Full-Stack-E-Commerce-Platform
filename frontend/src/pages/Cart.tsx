import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { cartService } from '../services/cartService';
import type { CartItemResponse } from '../services/cartService';
import Loader from '../components/Loader';

export default function Cart() {
    const [items, setItems] = useState<CartItemResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const loadCart = () => {
        setLoading(true);
        cartService
            .getCart()
            .then(setItems)
            .catch(() => setError('Failed to load cart'))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        loadCart();
    }, []);

    const handleQuantityChange = async (itemId: number, newQty: number) => {
        if (newQty < 1) return;
        try {
            await cartService.updateQuantity(itemId, newQty);
            loadCart();
        } catch {
            alert('Could not update quantity (may exceed available stock)');
        }
    };

    const handleRemove = async (itemId: number) => {
        try {
            await cartService.removeItem(itemId);
            loadCart();
        } catch {
            alert('Failed to remove item');
        }
    };

    if (loading) return <Loader />;
    if (error) return <p className="text-red-500">{error}</p>;

    if (items.length === 0) {
        return (
            <div className="text-center py-16">
                <p className="text-gray-500 mb-4">Your cart is empty.</p>
                <Link to="/products" className="text-blue-600 hover:underline">
                    Browse Products
                </Link>
            </div>
        );
    }

    const totalAmount = items.reduce(
        (sum, item) => sum + (item.product.discountPrice ?? item.product.price) * item.quantity,
        0
    );

    return (
        <div className="max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Your Cart</h1>

            <div className="bg-white rounded shadow divide-y">
                {items.map((item) => {
                    const price = item.product.discountPrice ?? item.product.price;
                    return (
                        <div key={item.id} className="flex items-center gap-4 p-4">
                            <img
                                src={item.product.imageUrl || 'https://via.placeholder.com/60'}
                                alt={item.product.name}
                                className="w-16 h-16 object-cover rounded"
                            />
                            <div className="flex-1">
                                <p className="font-semibold">{item.product.name}</p>
                                <p className="text-sm text-gray-500">₹{price}</p>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                    className="w-7 h-7 border rounded hover:bg-gray-100"
                                >
                                    −
                                </button>
                                <span className="w-6 text-center">{item.quantity}</span>
                                <button
                                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                    disabled={item.quantity >= item.product.stock}
                                    className="w-7 h-7 border rounded hover:bg-gray-100 disabled:opacity-40"
                                >
                                    +
                                </button>
                            </div>

                            <p className="font-semibold w-24 text-right">
                                ₹{(price * item.quantity).toFixed(2)}
                            </p>

                            <button
                                onClick={() => handleRemove(item.id)}
                                className="text-red-500 text-sm hover:underline"
                            >
                                Remove
                            </button>
                        </div>
                    );
                })}
            </div>

            <div className="bg-white rounded shadow p-4 mt-4 flex items-center justify-between">
                <span className="text-lg font-bold">Total Amount: ₹{totalAmount.toFixed(2)}</span>
                <Link
                    to="/checkout"
                    className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                >
                    Proceed to Checkout
                </Link>
            </div>
        </div>
    );
}
