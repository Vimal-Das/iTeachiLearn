import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { GraduationCap, Home } from 'lucide-react';

const Layout = () => {
    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
            <header className="bg-indigo-600 text-white shadow-lg">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <Link to="/" className="flex items-center space-x-2 text-xl font-bold hover:text-indigo-100 transition">
                        <GraduationCap size={32} />
                        <span>iTeachiLearn</span>
                    </Link>
                    <nav>
                        <Link to="/" className="flex items-center space-x-1 hover:text-indigo-200 transition">
                            <Home size={20} />
                            <span>Home</span>
                        </Link>
                    </nav>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                <Outlet />
            </main>

            <footer className="bg-slate-800 text-slate-400 py-6 mt-12">
                <div className="container mx-auto px-4 text-center">
                    <p>© 2025 iTeachiLearn Learning Platform</p>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
