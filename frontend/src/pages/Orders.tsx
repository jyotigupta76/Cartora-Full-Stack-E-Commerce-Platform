import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { orderService } from '../services/orderService';
import type { OrderResponse } from '../services/orderService';
import Loader from '../components/Loader';

const STATUS_COLORS: Record<string, string> = {
    PLACED: 'text-blue-600',
    CONFIRMED: 'text-blue-600',
    SHIPPED: 'text-amber-600',
    OUT_FOR_DELIVERY: 'text-amber-600',
    DELIVERED: 'text-green-600',
    CANCELLED: 'text-red-500',
};

export default function Orders() {
    const [orders, setOrders] = useState<OrderResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        orderService
            .getMyOrders()
            .then(setOrders)
            .catch(() => setError('Failed to load orders'))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <Loader />;
    if (error) return <p className="text-red-500">{error}</p>;

    if (orders.length === 0) {
        return (
            <div className="text-center py-16">
                <p className="text-gray-500 mb-4">You haven't placed any orders yet.</p>
                <Link to="/products" className="text-blue-600 hover:underline">
                    Browse Products
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">My Orders</h1>
            <div className="space-y-4">
                {orders.map((order) => (
                    <div key={order.id} className="bg-white rounded shadow p-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold">Order #{order.id}</span>
                            <span className={`text-sm font-semibold ${STATUS_COLORS[order.status]}`}>
                {order.status.replace(/_/g, ' ')}
              </span>
                        </div>
                        {order.items.map((item) => (
                            <div key={item.id} className="flex items-center gap-3 py-2 border-t first:border-t-0">
                                <img
                                    src={item.product.imageUrl || 'https://via.placeholder.com/40'}
                                    alt={item.product.name}
                                    className="w-10 h-10 object-cover rounded"
                                />
                                <span className="flex-1 text-sm">{item.product.name} &times; {item.quantity}</span>
                                <span className="text-sm">₹{(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                        ))}
                        <div className="flex items-center justify-between mt-3 pt-3 border-t">
                            <span className="font-bold">Total: ₹{order.totalAmount.toFixed(2)}</span>
                            <Link
                                to={`/orders/${order.id}`}
                                className="text-blue-600 text-sm hover:underline"
                            >
                                View Details / Track Order
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
