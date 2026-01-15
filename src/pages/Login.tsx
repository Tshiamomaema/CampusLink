import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Mail, Lock, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Logo from '../components/Logo';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { signIn } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const { error } = await signIn(email, password);

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            navigate('/');
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-black safe-area-top safe-area-bottom">
            {/* Header */}
            <div className="flex items-center justify-between p-4">
                <Link to="/welcome" className="p-2 hover:bg-white/10 rounded-full transition-colors">
                    <X size={20} className="text-twitter-textLight" />
                </Link>
                <div className="text-primary-500">
                    <Logo size={28} />
                </div>
                <div className="w-10"></div>
            </div>

            {/* Form */}
            <div className="flex-1 px-8 pt-8">
                <h1 className="text-2xl font-bold text-twitter-textLight mb-8">
                    Sign in to CampusLink
                </h1>

                {error && (
                    <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg mb-6">
                        <AlertCircle size={18} />
                        <span className="text-sm">{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <div className="relative">
                            <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-twitter-textGray" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="input pl-12"
                                placeholder="Email"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <div className="relative">
                            <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-twitter-textGray" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="input pl-12"
                                placeholder="Password"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !email || !password}
                        className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Signing in...' : 'Sign in'}
                    </button>
                </form>

                <p className="text-twitter-textGray mt-10">
                    Don't have an account?{' '}
                    <Link to="/signup" className="text-primary-500 hover:underline">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
}
