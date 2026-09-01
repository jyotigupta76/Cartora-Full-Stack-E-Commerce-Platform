import type { Product } from '../types/product.types';

interface Props {
    product: Product;
}

export default function ProductCard({ product }: Props) {
    return (
        <div className="bg-white rounded shadow p-4 flex flex-col">
            <img
                src={product.imageUrl || 'https://via.placeholder.com/200'}
                alt={product.name}
                className="h-40 object-cover rounded mb-3"
            />
            <h2 className="font-semibold text-lg">{product.name}</h2>
            <p className="text-sm text-gray-500 mb-2">{product.category?.name}</p>
            <p className="text-gray-700 text-sm flex-1">{product.description}</p>
            <div className="flex items-center justify-between mt-3">
                <span className="font-bold text-blue-600">₹{product.price}</span>
                <span className="text-xs text-gray-400">Qty: {product.quantity}</span>
            </div>
        </div>
    );
}
