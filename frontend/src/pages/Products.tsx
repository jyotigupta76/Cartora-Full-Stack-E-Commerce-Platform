import { useEffect, useState } from 'react';
import { productService } from '../services/productService';
import type { Product } from '../types/product.types';
import ProductCard from '../components/ProductCard';

export default function Products() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        productService
            .getAll()
            .then((data) => setProducts(data.content))
            .catch(() => setError('Failed to load products'))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <p>Loading products...</p>;
    if (error) return <p className="text-red-500">{error}</p>;
    if (products.length === 0) return <p>No products yet.</p>;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    );
}
