import { useEffect, useState } from 'react';
import { sellerService } from '../services/sellerService';
import Loader from '../components/Loader';

export default function SellerOrders() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        sellerService
            .getOrders()
            .then(setOrders)
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <Loader />;

    if (orders.length === 0) {
        return (
            <div>
                <h1 className="text-2xl font-bold mb-6">Orders</h1>
                <p className="text-gray-500">No orders for your products yet.</p>
            </div>
        );
    }

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Orders</h1>
            <div className="bg-white rounded shadow overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-left">
                    <tr>
                        <th className="p-3">Order #</th>
                        <th className="p-3">Customer</th>
                        <th className="p-3">Items</th>
                        <th className="p-3">Total</th>
                        <th className="p-3">Status</th>
                    </tr>
                    </thead>
                    <tbody>
                    {orders.map((order) => (
                        <tr key={order.id} className="border-t">
                            <td className="p-3">#{order.id}</td>
                            <td className="p-3">{order.user?.name}</td>
                            <td className="p-3">{order.items?.length ?? 0} item(s)</td>
                            <td className="p-3">₹{order.totalAmount}</td>
                            <td className="p-3">{order.status}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
