import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { productService } from '../services/productService';
import type { ProductDTO } from '../types/product.types';

export default function EditProduct() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [form, setForm] = useState<ProductDTO | null>(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;
        productService
            .getById(Number(id))
            .then((product) => {
                setForm({
                    name: product.name,
                    description: product.description,
                    categoryId: product.category.id,
                    brand: product.brand,
                    price: product.price,
                    discountPrice: product.discountPrice ?? undefined,
                    stock: product.stock,
                    imageUrl: product.imageUrl,
                });
            })
            .catch(() => setError('Failed to load product'))
            .finally(() => setLoading(false));
    }, [id]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setForm((prev) =>
            prev
                ? {
                    ...prev,
                    [name]: ['price', 'discountPrice', 'stock', 'categoryId'].includes(name)
                        ? value === '' ? undefined : Number(value)
                        : value,
                }
                : prev
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form || !id) return;
        setError('');
        try {
            await productService.update(Number(id), form);
            navigate(`/products/${id}`);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to update product');
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error && !form) return <p className="text-red-500">{error}</p>;
    if (!form) return null;

    return (
        <div className="max-w-lg mx-auto bg-white p-8 rounded shadow">
            <h1 className="text-2xl font-bold mb-6">Edit Product</h1>
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
                    Save Changes
                </button>
            </form>
        </div>
    );
}
