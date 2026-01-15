import { Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Zap } from 'lucide-react';
import BottomNav from './BottomNav';

export default function Layout() {
    const { profile } = useAuth();

    return (
        <div className="min-h-screen flex flex-col">
            {/* App Header */}
            <header className="app-header">
                <div className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-2">
                        <div className="bg-primary-500 p-1.5 rounded-lg">
                            <Zap size={18} className="text-white" />
                        </div>
                        <span className="font-bold text-lg">CampusLink</span>
                    </div>

                    {profile?.avatar_url ? (
                        <img
                            src={profile.avatar_url}
                            alt=""
                            className="w-8 h-8 rounded-full object-cover"
                        />
                    ) : (
                        <div className="w-8 h-8 rounded-full bg-primary-500/20 flex items-center justify-center">
                            <span className="text-primary-400 font-semibold text-sm">
                                {profile?.full_name?.charAt(0) || 'U'}
                            </span>
                        </div>
                    )}
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto pb-20">
                <div className="animate-fade-in">
                    <Outlet />
                </div>
            </main>

            {/* Bottom Navigation */}
            <BottomNav />
        </div>
    );
}
