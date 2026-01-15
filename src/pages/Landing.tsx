import { Link } from 'react-router-dom';
import { Zap } from 'lucide-react';

export default function Landing() {
    return (
        <div className="min-h-screen flex flex-col bg-black safe-area-top safe-area-bottom">
            {/* Main Content */}
            <div className="flex-1 flex flex-col items-center justify-center px-8">
                {/* Logo */}
                <div className="mb-12 animate-slide-up">
                    <div className="bg-primary-500 p-4 rounded-full">
                        <Zap size={48} className="text-white" />
                    </div>
                </div>

                {/* Tagline */}
                <div className="text-center mb-12 animate-slide-up" style={{ animationDelay: '100ms' }}>
                    <h1 className="text-3xl font-bold text-twitter-textLight mb-4">
                        See what's happening on your campus right now
                    </h1>
                </div>

                {/* CTA Buttons */}
                <div className="w-full max-w-xs space-y-4 animate-slide-up" style={{ animationDelay: '200ms' }}>
                    <Link
                        to="/signup"
                        className="btn-primary block text-center text-lg"
                    >
                        Create account
                    </Link>

                    <div className="relative py-2">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-twitter-border"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-black text-twitter-textGray">or</span>
                        </div>
                    </div>

                    <p className="text-twitter-textGray text-sm">
                        Already have an account?
                    </p>
                    <Link
                        to="/login"
                        className="btn-outline block text-center"
                    >
                        Sign in
                    </Link>
                </div>
            </div>

            {/* Footer */}
            <div className="text-center py-6 text-twitter-textGray text-xs px-4">
                By signing up, you agree to our Terms and Privacy Policy. For verified university students only.
            </div>
        </div>
    );
}
