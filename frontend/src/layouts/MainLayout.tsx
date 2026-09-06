import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Chatbot from '../components/Chatbot';

export default function MainLayout() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            <main className="p-6 flex-1">
                <Outlet />
            </main>
            <Footer />
            <Chatbot />
        </div>
    );
}
