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
        <nav className="app-bottom-nav">
            <div className="flex items-center justify-around py-2">
                {navItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        className={({ isActive }) =>
                            `nav-item touch-ripple py-2 px-4 rounded-xl ${isActive ? 'active' : ''}`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <item.icon
                                    size={24}
                                    strokeWidth={isActive ? 2.5 : 2}
                                    className="transition-all duration-200"
                                />
                                <span className="text-[10px] font-medium">{item.label}</span>
                            </>
                        )}
                    </NavLink>
                ))}
            </div>
        </nav>
    );
}
