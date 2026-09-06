import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { sellerService } from '../services/sellerService';
import type { SellerStats } from '../services/sellerService';
import Loader from '../components/Loader';

export default function SellerDashboard() {
    const [stats, setStats] = useState<SellerStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        sellerService
            .getStats()
            .then(setStats)
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <Loader />;

    const statCards = [
        { label: 'My Products', value: stats?.totalProducts ?? 0 },
        { label: 'Total Orders', value: stats?.totalOrders ?? 0 },
        { label: 'Revenue', value: `₹${(stats?.totalRevenue ?? 0).toLocaleString()}` },
        { label: 'Low Stock', value: stats?.lowStockCount ?? 0, warn: (stats?.lowStockCount ?? 0) > 0 },
    ];

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Seller Dashboard</h1>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {statCards.map((stat) => (
                    <div key={stat.label} className="bg-white rounded shadow p-4">
                        <p className="text-sm text-gray-500">{stat.label}</p>
                        <p className={`text-2xl font-bold mt-1 ${stat.warn ? 'text-red-500' : ''}`}>
                            {stat.value}
                        </p>
                    </div>
                ))}
            </div>

            <div className="flex gap-3 flex-wrap">
                <Link to="/seller/products" className="bg-white border rounded px-4 py-3 hover:bg-gray-50">
                    Manage Products
                </Link>
                <Link to="/seller/products/new" className="bg-blue-600 text-white rounded px-4 py-3 hover:bg-blue-700">
                    + Add Product
                </Link>
                <Link to="/seller/orders" className="bg-white border rounded px-4 py-3 hover:bg-gray-50">
                    Orders
                </Link>
            </div>
        </div>
    );
}
