import { Outlet } from 'react-router-dom';
import BottomNav from './BottomNav';
import { Zap, Bell } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Layout() {
    const { profile } = useAuth();

    return (
        <div className="min-h-screen pb-20">
            {/* Top Header */}
            <header className="sticky top-0 bg-campus-dark/80 backdrop-blur-lg border-b border-campus-border z-40">
                <div className="max-w-lg mx-auto flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-2">
                        <div className="bg-primary-500 p-1.5 rounded-lg">
                            <Zap size={18} className="text-white" />
                        </div>
                        <span className="font-bold text-lg">CampusLink</span>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="relative text-gray-400 hover:text-white transition-colors">
                            <Bell size={22} />
                            <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary-500 rounded-full"></span>
                        </button>
                        {profile?.avatar_url ? (
                            <img
                                src={profile.avatar_url}
                                alt=""
                                className="w-8 h-8 rounded-full object-cover"
                            />
                        ) : (
                            <div className="w-8 h-8 rounded-full bg-primary-500/20 flex items-center justify-center">
                                <span className="text-primary-400 font-medium text-sm">
                                    {profile?.full_name?.charAt(0) || 'U'}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-lg mx-auto">
                <Outlet />
            </main>

            {/* Bottom Navigation */}
            <BottomNav />
        </div>
    );
}
