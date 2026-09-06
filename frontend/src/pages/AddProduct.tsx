import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { productService } from '../services/productService';
import type { ProductDTO } from '../types/product.types';

export default function AddProduct() {
    const navigate = useNavigate();
    const [form, setForm] = useState<ProductDTO>({
        name: '',
        description: '',
        categoryId: 1,
        brand: '',
        price: 0,
        discountPrice: undefined,
        stock: 0,
        imageUrl: '',
    });
    const [error, setError] = useState('');

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: ['price', 'discountPrice', 'stock', 'categoryId'].includes(name)
                ? value === '' ? undefined : Number(value)
                : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            const product = await productService.create(form);
            navigate(`/products/${product.id}`);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to create product');
        }
    };

    return (
        <div className="max-w-lg mx-auto bg-white p-8 rounded shadow">
            <h1 className="text-2xl font-bold mb-6">Add Product</h1>
            {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    name="name"
                    placeholder="Product Name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                    required
                />
                <textarea
                    name="description"
                    placeholder="Description"
                    value={form.description}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                    rows={3}
                />
                <input
                    name="brand"
                    placeholder="Brand"
                    value={form.brand}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                />
                <input
                    name="categoryId"
                    type="number"
                    placeholder="Category ID"
                    value={form.categoryId}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                    required
                />
                <div className="grid grid-cols-2 gap-3">
                    <input
                        name="price"
                        type="number"
                        step="0.01"
                        placeholder="Price"
                        value={form.price}
                        onChange={handleChange}
                        className="border rounded px-3 py-2"
                        required
                    />
                    <input
                        name="discountPrice"
                        type="number"
                        step="0.01"
                        placeholder="Discount Price (optional)"
                        value={form.discountPrice ?? ''}
                        onChange={handleChange}
                        className="border rounded px-3 py-2"
                    />
                </div>
                <input
                    name="stock"
                    type="number"
                    placeholder="Stock"
                    value={form.stock}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                    required
                />
                <input
                    name="imageUrl"
                    placeholder="Image URL"
                    value={form.imageUrl}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                />
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                    Create Product
                </button>
            </form>
        </div>
    );
}
