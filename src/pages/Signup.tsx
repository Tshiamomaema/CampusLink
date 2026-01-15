import { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, Mail, Lock, User, AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { isUniversityEmail, getUniversityName } from '../lib/university';
import Logo from '../components/Logo';

export default function Signup() {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const { signUp } = useAuth();

    const detectedUniversity = email ? getUniversityName(email) : '';
    const isValidUniversityEmail = email ? isUniversityEmail(email) : false;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validation
        if (!isValidUniversityEmail) {
            setError('Please use a valid university email address (.ac.za or .edu domain)');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        const { error } = await signUp(email, password, fullName, detectedUniversity);

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            setSuccess(true);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen flex flex-col bg-black safe-area-top safe-area-bottom">
                <div className="flex-1 flex items-center justify-center px-8">
                    <div className="w-full max-w-sm text-center">
                        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle size={32} className="text-green-400" />
                        </div>
                        <h1 className="text-2xl font-bold text-twitter-textLight mb-2">Check your email</h1>
                        <p className="text-twitter-textGray mb-6">
                            We've sent a verification link to <span className="text-twitter-textLight font-medium">{email}</span>
                        </p>
                        <Link to="/login" className="btn-primary inline-block">
                            Back to Sign in
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

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
            <div className="flex-1 px-8 pt-4 pb-8 overflow-y-auto">
                <h1 className="text-2xl font-bold text-twitter-textLight mb-6">
                    Create your account
                </h1>

                {error && (
                    <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg mb-6">
                        <AlertCircle size={18} />
                        <span className="text-sm">{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <div className="relative">
                            <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-twitter-textGray" />
                            <input
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="input pl-12"
                                placeholder="Full name"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <div className="relative">
                            <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-twitter-textGray" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="input pl-12"
                                placeholder="University email"
                                required
                            />
                        </div>
                        {email && (
                            <div className={`mt-2 text-sm ${isValidUniversityEmail ? 'text-green-400' : 'text-yellow-400'}`}>
                                {isValidUniversityEmail ? (
                                    <span className="flex items-center gap-1">
                                        <CheckCircle size={14} />
                                        {detectedUniversity}
                                    </span>
                                ) : (
                                    'Use a university email (.ac.za or .edu)'
                                )}
                            </div>
                        )}
                    </div>

                    <div>
                        <div className="relative">
                            <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-twitter-textGray" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="input pl-12 pr-12"
                                placeholder="Password"
                                required
                                minLength={6}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-twitter-textGray hover:text-twitter-textLight"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <div>
                        <div className="relative">
                            <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-twitter-textGray" />
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="input pl-12 pr-12"
                                placeholder="Confirm password"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-twitter-textGray hover:text-twitter-textLight"
                            >
                                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Creating account...' : 'Create account'}
                    </button>
                </form>

                <p className="text-twitter-textGray mt-8 text-sm">
                    By signing up, you agree to our Terms of Service and Privacy Policy.
                </p>

                <p className="text-twitter-textGray mt-6">
                    Already have an account?{' '}
                    <Link to="/login" className="text-primary-500 hover:underline">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}
