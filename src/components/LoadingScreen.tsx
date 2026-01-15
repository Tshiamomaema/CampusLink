import Logo from './Logo';

export default function LoadingScreen() {
    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center">
            <div className="animate-pulse">
                <div className="text-primary-500">
                    <Logo size={64} />
                </div>
            </div>
            <p className="mt-4 text-twitter-textGray text-sm animate-pulse">Loading...</p>
        </div>
    );
}
