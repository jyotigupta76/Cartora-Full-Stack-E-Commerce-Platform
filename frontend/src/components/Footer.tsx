export default function Footer() {
    return (
        <footer className="bg-brand-700 mt-12 py-8 text-center text-sm text-brand-200">
            <p className="font-display text-lg text-white mb-1">Marketa</p>
            <p>&copy; {new Date().getFullYear()} Built as a learning project.</p>
        </footer>
    );
}
