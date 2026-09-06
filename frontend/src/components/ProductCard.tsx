import { Link } from 'react-router-dom';
import type { Product } from '../types/product.types';

interface Props {
    product: Product;
}

export default function ProductCard({ product }: Props) {
    const displayPrice = product.discountPrice ?? product.price;
    const hasDiscount = product.discountPrice != null && product.discountPrice < product.price;

    return (
        <Link
            to={`/products/${product.id}`}
            className="bg-white rounded-xl border border-brand-100 p-4 flex flex-col hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
        >
            <div className="relative">
                <img
                    src={product.imageUrl || 'https://via.placeholder.com/200'}
                    alt={product.name}
                    className="h-40 w-full object-cover rounded-lg mb-3"
                />
                {hasDiscount && (
                    <span className="absolute top-2 left-2 bg-amber-accent text-brand-900 text-xs font-bold px-2 py-1 rounded-full">
            SALE
          </span>
                )}
            </div>

            <p className="text-xs text-brand-400 font-medium uppercase tracking-wide mb-1">
                {product.category?.name}
            </p>
            <h2 className="font-display font-semibold text-lg text-brand-900 leading-snug">
                {product.name}
            </h2>

            <div className="flex items-center gap-1 text-sm mt-1 mb-2">
                <span className="text-amber-accent">★</span>
                <span className="text-brand-400">{product.averageRating.toFixed(1)}</span>
            </div>

            <div className="flex items-center justify-between mt-auto pt-2">
                <div className="flex items-baseline gap-2">
                    <span className="font-display font-bold text-lg text-brand-600">₹{displayPrice}</span>
                    {hasDiscount && (
                        <span className="text-xs text-brand-300 line-through">₹{product.price}</span>
                    )}
                </div>
                <span className={`text-xs font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-400'}`}>
          {product.stock > 0 ? `${product.stock} left` : 'Sold out'}
        </span>
            </div>
        </Link>
    );
}
