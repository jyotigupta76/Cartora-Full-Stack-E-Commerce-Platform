import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { orderService } from '../services/orderService';
import type { OrderResponse } from '../services/orderService';
import OrderStatusTracker from '../components/OrderStatusTracker';
import Loader from '../components/Loader';

export default function OrderDetails() {
    const { id } = useParams<{ id: string }>();
    const [order, setOrder] = useState<OrderResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [cancelling, setCancelling] = useState(false);

    const loadOrder = () => {
        if (!id) return;
        setLoading(true);
        orderService
            .getOrderById(Number(id))
            .then(setOrder)
            .catch(() => setError('Order not found'))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        loadOrder();
    }, [id]);

    const handleCancel = async () => {
        if (!order || !confirm('Cancel this order?')) return;
        setCancelling(true);
        try {
            await orderService.cancelOrder(order.id);
            loadOrder();
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to cancel order');
        } finally {
            setCancelling(false);
        }
    };

    if (loading) return <Loader />;
    if (error) return <p className="text-red-500">{error}</p>;
    if (!order) return null;

    const canCancel = order.status === 'PLACED' || order.status === 'CONFIRMED';

    return (
        <div className="max-w-3xl mx-auto">
            <Link to="/orders" className="text-blue-600 text-sm hover:underline">
                &larr; Back to My Orders
            </Link>

            <div className="bg-white rounded shadow p-6 mt-4">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-xl font-bold">Order #{order.id}</h1>
                    <span className="text-sm text-gray-500">
            {new Date(order.createdAt).toLocaleDateString()}
          </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <h2 className="font-semibold mb-2">Order Tracking</h2>
                        <OrderStatusTracker status={order.status} />
                    </div>
                    <div>
                        <h2 className="font-semibold mb-2">Shipping Address</h2>
                        <p className="text-sm text-gray-700">
                            {order.recipientName}<br />
                            {order.address}<br />
                            {order.city}, {order.state} - {order.pincode}<br />
                            Phone: {order.phone}
                        </p>
                    </div>
                </div>

                <h2 className="font-semibold mb-2">Items</h2>
                <div className="divide-y">
                    {order.items.map((item) => (
                        <div key={item.id} className="flex items-center gap-3 py-2">
                            <img
                                src={item.product.imageUrl || 'https://via.placeholder.com/50'}
                                alt={item.product.name}
                                className="w-12 h-12 object-cover rounded"
                            />
                            <span className="flex-1 text-sm">{item.product.name} &times; {item.quantity}</span>
                            <span className="text-sm">₹{(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                    ))}
                </div>

                <div className="mt-4 pt-4 border-t space-y-1 text-sm">
                    <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>₹{order.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Delivery</span>
                        <span>₹{order.deliveryCharge.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-base pt-1">
                        <span>Total</span>
                        <span>₹{order.totalAmount.toFixed(2)}</span>
                    </div>
                </div>

                {canCancel && (
                    <button
                        onClick={handleCancel}
                        disabled={cancelling}
                        className="mt-6 text-red-500 text-sm hover:underline disabled:opacity-50"
                    >
                        {cancelling ? 'Cancelling...' : 'Cancel Order'}
                    </button>
                )}
            </div>
        </div>
    );
}
