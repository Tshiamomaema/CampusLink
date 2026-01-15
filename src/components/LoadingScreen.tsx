import { Loader2 } from 'lucide-react';

export default function LoadingScreen() {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <Loader2 size={32} className="text-primary-500 animate-spin" />
        </div>
    );
}
