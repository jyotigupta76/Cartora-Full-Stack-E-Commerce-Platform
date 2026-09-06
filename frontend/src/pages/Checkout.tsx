import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cartService } from '../services/cartService';
import type { CartItemResponse } from '../services/cartService';
import { orderService } from '../services/orderService';
import type { CheckoutRequest } from '../services/orderService';
import Loader from '../components/Loader';

const DELIVERY_CHARGE = 100;

export default function Checkout() {
    const navigate = useNavigate();
    const [items, setItems] = useState<CartItemResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const [form, setForm] = useState<CheckoutRequest>({
        name: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        paymentMethod: 'COD',
    });

    useEffect(() => {
        cartService
            .getCart()
            .then(setItems)
            .catch(() => setError('Failed to load cart'))
            .finally(() => setLoading(false));
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const subtotal = items.reduce(
        (sum, item) => sum + (item.product.discountPrice ?? item.product.price) * item.quantity,
        0
    );
    const total = subtotal + DELIVERY_CHARGE;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSubmitting(true);
        try {
            const order = await orderService.checkout(form);
            navigate(`/orders/${order.id}`);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Checkout failed');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <Loader />;

    if (items.length === 0) {
        return <p className="text-center py-16 text-gray-500">Your cart is empty.</p>;
    }

    return (
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Shipping form */}
            <div className="bg-white rounded shadow p-6">
                <h1 className="text-xl font-bold mb-4">Shipping Details</h1>
                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-3">
                    <input
                        name="name"
                        placeholder="Full Name"
                        value={form.name}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2"
                        required
                    />
                    <input
                        name="phone"
                        placeholder="Phone Number"
                        value={form.phone}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2"
                        required
                    />
                    <input
                        name="address"
                        placeholder="Address"
                        value={form.address}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2"
                        required
                    />
                    <div className="grid grid-cols-2 gap-3">
                        <input
                            name="city"
                            placeholder="City"
                            value={form.city}
                            onChange={handleChange}
                            className="border rounded px-3 py-2"
                            required
                        />
                        <input
                            name="state"
                            placeholder="State"
                            value={form.state}
                            onChange={handleChange}
                            className="border rounded px-3 py-2"
                            required
                        />
                    </div>
                    <input
                        name="pincode"
                        placeholder="Pincode"
                        value={form.pincode}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2"
                        required
                    />

                    <div>
                        <label className="text-sm font-semibold block mb-1">Payment Method</label>
                        <select
                            name="paymentMethod"
                            value={form.paymentMethod}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2"
                        >
                            <option value="COD">Cash on Delivery</option>
                            <option value="ONLINE">Online Payment</option>
                        </select>
                        {form.paymentMethod === 'ONLINE' && (
                            <p className="text-xs text-amber-600 mt-1">
                                Online payment gateway isn't connected yet — this will place the
                                order with payment marked as pending.
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 disabled:bg-gray-300"
                    >
                        {submitting ? 'Placing Order...' : 'Place Order'}
                    </button>
                </form>
            </div>

            {/* Order summary */}
            <div className="bg-white rounded shadow p-6 h-fit">
                <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                <div className="space-y-2">
                    {items.map((item) => {
                        const price = item.product.discountPrice ?? item.product.price;
                        return (
                            <div key={item.id} className="flex justify-between text-sm">
                                <span>{item.product.name} &times; {item.quantity}</span>
                                <span>₹{(price * item.quantity).toFixed(2)}</span>
                            </div>
                        );
                    })}
                </div>
                <hr className="my-3" />
                <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span>Delivery</span>
                    <span>₹{DELIVERY_CHARGE.toFixed(2)}</span>
                </div>
                <hr className="my-3" />
                <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>₹{total.toFixed(2)}</span>
                </div>
            </div>
        </div>
    );
}
