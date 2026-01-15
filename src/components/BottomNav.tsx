import { NavLink } from 'react-router-dom';
import { Home, Search, PlusSquare, ShoppingBag, User } from 'lucide-react';

export default function BottomNav() {
    const navItems = [
        { to: '/', icon: Home, label: 'Home' },
        { to: '/explore', icon: Search, label: 'Search' },
        { to: '/create', icon: PlusSquare, label: 'Post' },
        { to: '/marketplace', icon: ShoppingBag, label: 'Shop' },
        { to: '/profile', icon: User, label: 'Me' },
    ];

    return (
        <nav className="app-bottom-nav">
            <div className="flex items-center justify-around py-3">
                {navItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        className={({ isActive }) =>
                            `p-3 rounded-full transition-colors ${isActive ? 'text-twitter-textLight' : 'text-twitter-textGray hover:bg-white/10'}`
                        }
                    >
                        {({ isActive }) => (
                            <item.icon
                                size={26}
                                strokeWidth={isActive ? 2.5 : 1.5}
                                fill={isActive ? 'currentColor' : 'none'}
                            />
                        )}
                    </NavLink>
                ))}
            </div>
        </nav>
    );
}
