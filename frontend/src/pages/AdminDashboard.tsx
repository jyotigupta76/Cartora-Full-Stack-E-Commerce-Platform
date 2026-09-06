import { useEffect, useState } from 'react';
import { adminService } from '../services/adminService';
import type { AdminStats, AdminUser } from '../services/adminService';
import { productService } from '../services/productService';
import type { Product } from '../types/product.types';
import Loader from '../components/Loader';

type Tab = 'users' | 'products' | 'orders';

const ORDER_STATUSES = ['PLACED', 'CONFIRMED', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'];

export default function AdminDashboard() {
    const [stats, setStats] = useState<AdminStats | null>(null);
    const [tab, setTab] = useState<Tab>('users');

    const [users, setUsers] = useState<AdminUser[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        adminService.getStats().then(setStats).catch(() => {});
    }, []);

    useEffect(() => {
        setLoading(true);
        if (tab === 'users') {
            adminService.getAllUsers().then(setUsers).finally(() => setLoading(false));
        } else if (tab === 'products') {
            productService.getAll({ size: 100 }).then((data) => setProducts(data.content)).finally(() => setLoading(false));
        } else if (tab === 'orders') {
            adminService.getAllOrders().then(setOrders).finally(() => setLoading(false));
        }
    }, [tab]);

    const handleBlockToggle = async (user: AdminUser) => {
        const updated = user.enabled
            ? await adminService.blockUser(user.id)
            : await adminService.unblockUser(user.id);
        setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
    };

    const handleDeleteUser = async (id: number) => {
        if (!confirm('Delete this user?')) return;
        await adminService.deleteUser(id);
        setUsers((prev) => prev.filter((u) => u.id !== id));
    };

    const handleDeleteProduct = async (id: number) => {
        if (!confirm('Delete this product?')) return;
        await productService.delete(id);
        setProducts((prev) => prev.filter((p) => p.id !== id));
    };

    const handleStatusChange = async (orderId: number, status: string) => {
        const updated = await adminService.updateOrderStatus(orderId, status);
        setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
    };

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

            {stats && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white rounded shadow p-4">
                        <p className="text-sm text-gray-500">Users</p>
                        <p className="text-2xl font-bold mt-1">{stats.totalUsers.toLocaleString()}</p>
                    </div>
                    <div className="bg-white rounded shadow p-4">
                        <p className="text-sm text-gray-500">Products</p>
                        <p className="text-2xl font-bold mt-1">{stats.totalProducts.toLocaleString()}</p>
                    </div>
                    <div className="bg-white rounded shadow p-4">
                        <p className="text-sm text-gray-500">Orders</p>
                        <p className="text-2xl font-bold mt-1">{stats.totalOrders.toLocaleString()}</p>
                    </div>
                    <div className="bg-white rounded shadow p-4">
                        <p className="text-sm text-gray-500">Revenue</p>
                        <p className="text-2xl font-bold mt-1">₹{stats.totalRevenue.toLocaleString()}</p>
                    </div>
                </div>
            )}

            <div className="flex gap-2 mb-4 border-b">
                {(['users', 'products', 'orders'] as Tab[]).map((t) => (
                    <button
                        key={t}
                        onClick={() => setTab(t)}
                        className={`px-4 py-2 capitalize ${
                            tab === t ? 'border-b-2 border-blue-600 text-blue-600 font-semibold' : 'text-gray-500'
                        }`}
                    >
                        {t}
                    </button>
                ))}
            </div>

            {loading ? (
                <Loader />
            ) : tab === 'users' ? (
                <div className="bg-white rounded shadow overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-left">
                        <tr>
                            <th className="p-3">User</th>
                            <th className="p-3">Email</th>
                            <th className="p-3">Role</th>
                            <th className="p-3">Status</th>
                            <th className="p-3">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {users.map((user) => (
                            <tr key={user.id} className="border-t">
                                <td className="p-3">{user.name}</td>
                                <td className="p-3">{user.email}</td>
                                <td className="p-3">{user.role}</td>
                                <td className="p-3">
                    <span className={user.enabled ? 'text-green-600' : 'text-red-500'}>
                      {user.enabled ? 'Active' : 'Blocked'}
                    </span>
                                </td>
                                <td className="p-3 flex gap-2">
                                    <button
                                        onClick={() => handleBlockToggle(user)}
                                        className="text-blue-600 hover:underline"
                                    >
                                        {user.enabled ? 'Block' : 'Unblock'}
                                    </button>
                                    <button
                                        onClick={() => handleDeleteUser(user.id)}
                                        className="text-red-500 hover:underline"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            ) : tab === 'products' ? (
                <div className="bg-white rounded shadow overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-left">
                        <tr>
                            <th className="p-3">Product</th>
                            <th className="p-3">Category</th>
                            <th className="p-3">Seller</th>
                            <th className="p-3">Price</th>
                            <th className="p-3">Stock</th>
                            <th className="p-3">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {products.map((product) => (
                            <tr key={product.id} className="border-t">
                                <td className="p-3">{product.name}</td>
                                <td className="p-3">{product.category?.name}</td>
                                <td className="p-3">{product.seller?.name}</td>
                                <td className="p-3">₹{product.price}</td>
                                <td className="p-3">{product.stock}</td>
                                <td className="p-3">
                                    <button
                                        onClick={() => handleDeleteProduct(product.id)}
                                        className="text-red-500 hover:underline"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="bg-white rounded shadow overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-left">
                        <tr>
                            <th className="p-3">Order #</th>
                            <th className="p-3">Customer</th>
                            <th className="p-3">Total</th>
                            <th className="p-3">Status</th>
                        </tr>
                        </thead>
                        <tbody>
                        {orders.map((order) => (
                            <tr key={order.id} className="border-t">
                                <td className="p-3">#{order.id}</td>
                                <td className="p-3">{order.user?.name}</td>
                                <td className="p-3">₹{order.totalAmount}</td>
                                <td className="p-3">
                                    <select
                                        value={order.status}
                                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                        className="border rounded px-2 py-1"
                                    >
                                        {ORDER_STATUSES.map((s) => (
                                            <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
                                        ))}
                                    </select>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
