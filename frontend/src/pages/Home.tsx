import { Link } from 'react-router-dom';

export default function Home() {
    return (
        <div className="text-center py-24">
            <p className="text-amber-accent-dark font-semibold text-sm tracking-wide mb-3">
                Fresh finds, every day
            </p>
            <h1 className="font-display text-5xl font-semibold text-brand-900 mb-4 leading-tight">
                Everything you need,
                <br />in one marketplace
            </h1>
            <p className="text-brand-400 mb-8 max-w-md mx-auto">
                Browse products from independent sellers, all in one place — curated,
                searchable, and ready to ship.
            </p>
            <Link
                to="/products"
                className="inline-block bg-brand-500 text-white px-8 py-3 rounded-full font-semibold hover:bg-brand-600 transition-colors"
            >
                Start Browsing
            </Link>
        </div>
    );
}
