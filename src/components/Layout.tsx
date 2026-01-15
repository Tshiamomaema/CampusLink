import { Outlet, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Zap } from 'lucide-react';
import BottomNav from './BottomNav';

export default function Layout() {
    const { profile } = useAuth();

    return (
        <div className="min-h-screen flex flex-col bg-black">
            {/* Twitter-style Header */}
            <header className="app-header">
                <div className="flex items-center justify-between px-4 py-3">
                    <Link to="/profile">
                        {profile?.avatar_url ? (
                            <img
                                src={profile.avatar_url}
                                alt=""
                                className="w-8 h-8 rounded-full object-cover"
                            />
                        ) : (
                            <div className="w-8 h-8 rounded-full bg-twitter-darkCard flex items-center justify-center">
                                <span className="text-twitter-textLight font-semibold text-sm">
                                    {profile?.full_name?.charAt(0) || 'U'}
                                </span>
                            </div>
                        )}
                    </Link>

                    <div className="bg-primary-500 p-1.5 rounded-full">
                        <Zap size={18} className="text-white" />
                    </div>

                    <div className="w-8"></div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto pb-16">
                <div className="animate-fade-in">
                    <Outlet />
                </div>
            </main>

            {/* Bottom Navigation */}
            <BottomNav />
        </div>
    );
}
