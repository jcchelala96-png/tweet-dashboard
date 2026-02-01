'use client';

import { useEffect, useState, useCallback } from 'react';
import { Tweet } from '@/lib/types';
import { AnalyticsView } from './AnalyticsView';
import { DataEntryView } from './DataEntryView';
import { SettingsPanel } from './SettingsPanel';
import { BarChart3, PenLine, Settings } from 'lucide-react';

type View = 'analytics' | 'data-entry';

interface Settings {
    categories: string[];
    types: string[];
}

export function Dashboard() {
    const [tweets, setTweets] = useState<Tweet[]>([]);
    const [settings, setSettings] = useState<Settings>({ categories: [], types: [] });
    const [loading, setLoading] = useState(true);
    const [activeView, setActiveView] = useState<View>('analytics');

    const loadSettings = useCallback(async () => {
        const res = await fetch('/api/settings');
        const data = await res.json();
        setSettings(data);
    }, []);

    useEffect(() => {
        Promise.all([
            fetch('/api/tweets').then(res => res.json()),
            fetch('/api/settings').then(res => res.json())
        ]).then(([tweetsData, settingsData]) => {
            setTweets(tweetsData);
            setSettings(settingsData);
            setLoading(false);
        }).catch(err => console.error(err));
    }, []);

    const handleAdd = (newTweet: Tweet) => {
        setTweets(prev => [newTweet, ...prev]);
    };

    const handleUpdate = (updatedTweet: Tweet) => {
        setTweets(prev => prev.map(t => t.id === updatedTweet.id ? updatedTweet : t));
    };

    const handleDelete = (id: string) => {
        setTweets(prev => prev.filter(t => t.id !== id));
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--background)' }}>
                <div className="flex items-center gap-3">
                    <div className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'var(--accent-primary)', borderTopColor: 'transparent' }} />
                    <span style={{ color: 'var(--foreground-muted)' }}>Loading dashboard...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen" style={{ background: 'var(--background)' }}>
            {/* Top Navigation Bar */}
            <header
                className="sticky top-0 z-50 backdrop-blur-xl"
                style={{
                    background: 'rgba(10, 10, 11, 0.8)',
                    borderBottom: '1px solid var(--border-subtle)'
                }}
            >
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    {/* Logo / Title */}
                    <div className="flex items-center gap-3">
                        <div
                            className="w-9 h-9 rounded-xl flex items-center justify-center"
                            style={{ background: 'var(--accent-primary)' }}
                        >
                            <BarChart3 className="w-5 h-5 text-white" />
                        </div>
                        <h1
                            className="text-xl font-semibold"
                            style={{ color: 'var(--foreground)', letterSpacing: '-0.02em' }}
                        >
                            Content Performance
                        </h1>
                    </div>

                    {/* Tab Navigation */}
                    <nav className="flex items-center gap-2">
                        <button
                            onClick={() => setActiveView('analytics')}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200"
                            style={{
                                background: activeView === 'analytics' ? 'var(--accent-primary)' : 'transparent',
                                color: activeView === 'analytics' ? 'white' : 'var(--foreground-muted)',
                                border: activeView === 'analytics' ? 'none' : '1px solid var(--border-subtle)'
                            }}
                        >
                            <BarChart3 className="w-4 h-4" />
                            Analytics
                        </button>
                        <button
                            onClick={() => setActiveView('data-entry')}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200"
                            style={{
                                background: activeView === 'data-entry' ? 'var(--accent-primary)' : 'transparent',
                                color: activeView === 'data-entry' ? 'white' : 'var(--foreground-muted)',
                                border: activeView === 'data-entry' ? 'none' : '1px solid var(--border-subtle)'
                            }}
                        >
                            <PenLine className="w-4 h-4" />
                            Data Entry
                        </button>
                    </nav>

                    {/* Settings */}
                    <SettingsPanel
                        categories={settings.categories}
                        types={settings.types}
                        onUpdate={loadSettings}
                    />
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-6 py-8">
                {activeView === 'analytics' ? (
                    <AnalyticsView tweets={tweets} />
                ) : (
                    <DataEntryView
                        tweets={tweets}
                        onAdd={handleAdd}
                        onUpdate={handleUpdate}
                        onDelete={handleDelete}
                        categories={settings.categories}
                        types={settings.types}
                    />
                )}
            </main>
        </div>
    );
}
