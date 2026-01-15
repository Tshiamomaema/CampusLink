import { Link } from 'react-router-dom';
import { Zap, Users, ShoppingBag, MessageCircle, ArrowRight, Sparkles } from 'lucide-react';

export default function Landing() {
    const features = [
        {
            icon: Users,
            title: 'Connect',
            description: 'Verified university students only',
        },
        {
            icon: MessageCircle,
            title: 'Share',
            description: 'Posts, photos & stories',
        },
        {
            icon: ShoppingBag,
            title: 'Trade',
            description: 'Student marketplace',
        },
    ];

    return (
        <div className="min-h-screen flex flex-col safe-area-top safe-area-bottom">
            {/* Hero Section */}
            <div className="flex-1 flex flex-col items-center justify-center px-6 py-8 text-center">
                {/* Logo with animation */}
                <div className="flex items-center gap-3 mb-8 animate-slide-up">
                    <div className="bg-primary-500 p-3 rounded-2xl shadow-lg shadow-primary-500/30">
                        <Zap size={32} className="text-white" />
                    </div>
                    <span className="text-3xl font-bold">CampusLink</span>
                </div>

                {/* Tagline */}
                <div className="animate-slide-up" style={{ animationDelay: '100ms' }}>
                    <div className="flex items-center justify-center gap-2 mb-3">
                        <Sparkles size={16} className="text-primary-400" />
                        <span className="text-primary-400 text-sm font-medium">For Students Only</span>
                        <Sparkles size={16} className="text-primary-400" />
                    </div>
                    <h1 className="text-3xl font-bold mb-4">
                        Your <span className="text-gradient">Campus</span>,<br />
                        Your <span className="text-gradient">Community</span>
                    </h1>
                    <p className="text-gray-400 mb-8 max-w-xs mx-auto">
                        Connect with students from your campus and universities across the country
                    </p>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col gap-3 w-full max-w-xs animate-slide-up" style={{ animationDelay: '200ms' }}>
                    <Link
                        to="/signup"
                        className="btn-primary flex items-center justify-center gap-2 text-lg"
                    >
                        Get Started
                        <ArrowRight size={20} />
                    </Link>
                    <Link
                        to="/login"
                        className="btn-secondary text-center"
                    >
                        Sign In
                    </Link>
                </div>
            </div>

            {/* Features Section */}
            <div className="px-6 pb-8">
                <div className="grid grid-cols-3 gap-3 stagger-children">
                    {features.map((feature, index) => (
                        <div key={index} className="card-pressable p-4 text-center">
                            <div className="w-10 h-10 rounded-xl bg-primary-500/20 flex items-center justify-center mx-auto mb-2">
                                <feature.icon size={20} className="text-primary-400" />
                            </div>
                            <h3 className="font-semibold text-sm mb-1">{feature.title}</h3>
                            <p className="text-gray-500 text-xs leading-tight">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer */}
            <div className="text-center py-4 text-gray-600 text-xs">
                © 2026 CampusLink
            </div>
        </div>
    );
}
