import { Link } from 'react-router-dom';
import { Zap, Users, ShoppingBag, MessageCircle, ArrowRight } from 'lucide-react';

export default function Landing() {
    const features = [
        {
            icon: Users,
            title: 'Connect with Students',
            description: 'Join a community of verified university students across the country',
        },
        {
            icon: MessageCircle,
            title: 'Share & Engage',
            description: 'Post updates, share photos, and engage with campus content',
        },
        {
            icon: ShoppingBag,
            title: 'Student Marketplace',
            description: 'Buy and sell textbooks, electronics, and more with fellow students',
        },
    ];

    return (
        <div className="min-h-screen flex flex-col">
            {/* Hero Section */}
            <div className="flex-1 flex flex-col items-center justify-center px-4 py-12 text-center">
                {/* Logo */}
                <div className="flex items-center gap-3 mb-6">
                    <div className="bg-primary-500 p-3 rounded-2xl">
                        <Zap size={36} className="text-white" />
                    </div>
                    <span className="text-4xl font-bold">CampusLink</span>
                </div>

                {/* Tagline */}
                <h1 className="text-3xl md:text-4xl font-bold mb-4 max-w-lg">
                    Your <span className="text-gradient">University</span>, Your <span className="text-gradient">Community</span>
                </h1>
                <p className="text-gray-400 text-lg mb-8 max-w-md">
                    Connect with students from your campus and universities across the country. Share, discover, and trade.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
                    <Link
                        to="/signup"
                        className="btn-primary flex-1 flex items-center justify-center gap-2"
                    >
                        Get Started
                        <ArrowRight size={18} />
                    </Link>
                    <Link
                        to="/login"
                        className="btn-secondary flex-1"
                    >
                        Sign In
                    </Link>
                </div>
            </div>

            {/* Features Section */}
            <div className="px-4 pb-12">
                <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
                    {features.map((feature, index) => (
                        <div key={index} className="card p-6 text-center">
                            <div className="w-12 h-12 rounded-xl bg-primary-500/20 flex items-center justify-center mx-auto mb-4">
                                <feature.icon size={24} className="text-primary-400" />
                            </div>
                            <h3 className="font-semibold mb-2">{feature.title}</h3>
                            <p className="text-gray-400 text-sm">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer */}
            <div className="text-center py-6 text-gray-500 text-sm">
                © 2026 CampusLink. For verified university students only.
            </div>
        </div>
    );
}
