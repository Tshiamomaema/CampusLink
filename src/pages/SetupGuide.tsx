import { Zap, Database, Key, Terminal, CheckCircle } from 'lucide-react';

export default function SetupGuide() {
    const steps = [
        {
            icon: Database,
            title: '1. Create Supabase Project',
            description: 'Go to supabase.com and create a new project',
            link: 'https://supabase.com/dashboard',
        },
        {
            icon: Key,
            title: '2. Get API Credentials',
            description: 'Find your Project URL and anon key in Settings > API',
        },
        {
            icon: Terminal,
            title: '3. Create .env.local file',
            description: 'Add your credentials to a .env.local file in the project root',
            code: `VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key`,
        },
        {
            icon: Database,
            title: '4. Run Database Schema',
            description: 'Copy supabase/schema.sql and run it in the SQL Editor',
        },
        {
            icon: CheckCircle,
            title: '5. Restart Dev Server',
            description: 'Stop the server (Ctrl+C) and run npm run dev again',
        },
    ];

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="max-w-2xl w-full">
                {/* Logo */}
                <div className="flex items-center justify-center gap-3 mb-8">
                    <div className="bg-primary-500 p-3 rounded-2xl">
                        <Zap size={32} className="text-white" />
                    </div>
                    <span className="text-3xl font-bold">CampusLink</span>
                </div>

                {/* Welcome Card */}
                <div className="card p-8">
                    <h1 className="text-2xl font-bold text-center mb-2">Welcome to CampusLink! 🎉</h1>
                    <p className="text-gray-400 text-center mb-8">
                        Let's get your development environment set up
                    </p>

                    {/* Setup Steps */}
                    <div className="space-y-6">
                        {steps.map((step, index) => (
                            <div key={index} className="flex gap-4">
                                <div className="flex-shrink-0">
                                    <div className="w-10 h-10 rounded-full bg-primary-500/20 flex items-center justify-center">
                                        <step.icon size={20} className="text-primary-400" />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold mb-1">{step.title}</h3>
                                    <p className="text-gray-400 text-sm">{step.description}</p>
                                    {step.link && (
                                        <a
                                            href={step.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-primary-400 hover:text-primary-300 text-sm mt-1 inline-block"
                                        >
                                            Open Supabase →
                                        </a>
                                    )}
                                    {step.code && (
                                        <pre className="mt-2 bg-campus-dark p-3 rounded-lg text-sm text-gray-300 overflow-x-auto">
                                            {step.code}
                                        </pre>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Help */}
                    <div className="mt-8 pt-6 border-t border-campus-border text-center">
                        <p className="text-gray-500 text-sm">
                            After completing these steps, refresh this page to see the login screen.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
