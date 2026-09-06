import { useEffect, useMemo, useState } from 'react';
import { productService } from '../services/productService';
import { debounce } from '../utils/debounce';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import type { Product, ProductSearchParams } from '../types/product.types';

const SORT_OPTIONS = [
    { label: 'Newest', sortBy: 'createdAt', sortDir: 'desc' as const },
    { label: 'Price: Low to High', sortBy: 'price', sortDir: 'asc' as const },
    { label: 'Price: High to Low', sortBy: 'price', sortDir: 'desc' as const },
    { label: 'Rating', sortBy: 'averageRating', sortDir: 'desc' as const },
];

export default function Products() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [searchInput, setSearchInput] = useState('');
    const [search, setSearch] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [brand, setBrand] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [inStock, setInStock] = useState(false);
    const [sortIndex, setSortIndex] = useState(0);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const pageSize = 12;

    const debouncedSetSearch = useMemo(() => debounce((value: string) => {
        setSearch(value);
        setPage(0);
    }, 400), []);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchInput(e.target.value);
        debouncedSetSearch(e.target.value);
    };

    useEffect(() => {
        setLoading(true);
        const params: ProductSearchParams = {
            search: search || undefined,
            categoryId: categoryId ? Number(categoryId) : undefined,
            brand: brand || undefined,
            minPrice: minPrice ? Number(minPrice) : undefined,
            maxPrice: maxPrice ? Number(maxPrice) : undefined,
            inStock: inStock || undefined,
            sortBy: SORT_OPTIONS[sortIndex].sortBy,
            sortDir: SORT_OPTIONS[sortIndex].sortDir,
            page,
            size: pageSize,
        };

        productService
            .getAll(params)
            .then((data) => {
                setProducts(data.content);
                setTotalPages(data.totalPages);
            })
            .catch(() => setError('Failed to load products'))
            .finally(() => setLoading(false));
    }, [search, categoryId, brand, minPrice, maxPrice, inStock, sortIndex, page]);

    const resetFilters = () => {
        setSearchInput('');
        setSearch('');
        setCategoryId('');
        setBrand('');
        setMinPrice('');
        setMaxPrice('');
        setInStock(false);
        setSortIndex(0);
        setPage(0);
    };

    return (
        <div>
            <input
                type="text"
                placeholder="Search products..."
                value={searchInput}
                onChange={handleSearchChange}
                className="w-full border rounded px-4 py-2 mb-4"
            />

            <div className="flex flex-col md:flex-row gap-6">
                <aside className="md:w-56 bg-white rounded shadow p-4 h-fit space-y-4">
                    <div>
                        <label className="text-sm font-semibold block mb-1">Category ID</label>
                        <input
                            type="number"
                            value={categoryId}
                            onChange={(e) => { setCategoryId(e.target.value); setPage(0); }}
                            className="w-full border rounded px-2 py-1"
                            placeholder="e.g. 1"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-semibold block mb-1">Brand</label>
                        <input
                            type="text"
                            value={brand}
                            onChange={(e) => { setBrand(e.target.value); setPage(0); }}
                            className="w-full border rounded px-2 py-1"
                            placeholder="e.g. Poco"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-semibold block mb-1">
                            Price: ₹{minPrice || 0} - ₹{maxPrice || '∞'}
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="number"
                                value={minPrice}
                                onChange={(e) => { setMinPrice(e.target.value); setPage(0); }}
                                className="w-1/2 border rounded px-2 py-1"
                                placeholder="Min"
                            />
                            <input
                                type="number"
                                value={maxPrice}
                                onChange={(e) => { setMaxPrice(e.target.value); setPage(0); }}
                                className="w-1/2 border rounded px-2 py-1"
                                placeholder="Max"
                            />
                        </div>
                    </div>

                    <label className="flex items-center gap-2 text-sm">
                        <input
                            type="checkbox"
                            checked={inStock}
                            onChange={(e) => { setInStock(e.target.checked); setPage(0); }}
                        />
                        In stock only
                    </label>

                    <button onClick={resetFilters} className="text-sm text-blue-600 hover:underline">
                        Reset filters
                    </button>
                </aside>

                <div className="flex-1">
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-sm text-gray-500">
                            {loading ? 'Loading...' : `${products.length} products`}
                        </p>
                        <select
                            value={sortIndex}
                            onChange={(e) => { setSortIndex(Number(e.target.value)); setPage(0); }}
                            className="border rounded px-3 py-1 text-sm"
                        >
                            {SORT_OPTIONS.map((opt, i) => (
                                <option key={opt.label} value={i}>{opt.label}</option>
                            ))}
                        </select>
                    </div>

                    {error && <p className="text-red-500">{error}</p>}

                    {loading ? (
                        <Loader />
                    ) : products.length === 0 ? (
                        <p>No products found.</p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {products.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    )}

                    {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-2 mt-6">
                            <button
                                onClick={() => setPage((p) => Math.max(p - 1, 0))}
                                disabled={page === 0}
                                className="px-3 py-1 rounded bg-white border text-gray-700 disabled:opacity-40"
                            >
                                &lt; Previous
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setPage(i)}
                                    className={`px-3 py-1 rounded ${
                                        i === page ? 'bg-blue-600 text-white' : 'bg-white border text-gray-700'
                                    }`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                            <button
                                onClick={() => setPage((p) => Math.min(p + 1, totalPages - 1))}
                                disabled={page >= totalPages - 1}
                                className="px-3 py-1 rounded bg-white border text-gray-700 disabled:opacity-40"
                            >
                                Next &gt;
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
