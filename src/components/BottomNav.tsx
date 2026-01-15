import { NavLink } from 'react-router-dom';
import { Home, Search, PlusSquare, ShoppingBag, User } from 'lucide-react';

export default function BottomNav() {
    const navItems = [
        { to: '/', icon: Home, label: 'Home' },
        { to: '/explore', icon: Search, label: 'Explore' },
        { to: '/create', icon: PlusSquare, label: 'Post' },
        { to: '/marketplace', icon: ShoppingBag, label: 'Market' },
        { to: '/profile', icon: User, label: 'Profile' },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-campus-card border-t border-campus-border z-50">
            <div className="max-w-lg mx-auto flex justify-around items-center py-2">
                {navItems.map(({ to, icon: Icon, label }) => (
                    <NavLink
                        key={to}
                        to={to}
                        className={({ isActive }) =>
                            `nav-item py-2 px-4 ${isActive ? 'active' : ''}`
                        }
                    >
                        <Icon size={24} />
                        <span className="text-xs">{label}</span>
                    </NavLink>
                ))}
            </div>
        </nav>
    );
}
