'use client';

import { useEffect, useState, useCallback } from 'react';
import { Tweet } from '@/lib/types';
import { AnalyticsView } from './AnalyticsView';
import { DataEntryView } from './DataEntryView';
import { SettingsPanel } from './SettingsPanel';

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
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-[#7a6a5a] text-lg">Loading your dashboard...</div>
            </div>
        );
    }

    const tabStyle = (isActive: boolean) => ({
        background: isActive
            ? 'linear-gradient(135deg, #8b6f47 0%, #6b5237 100%)'
            : 'linear-gradient(135deg, #d4b896 0%, #c4a67a 100%)',
        color: isActive ? 'white' : '#4a3a2a',
    });

    return (
        <div className="min-h-screen p-4 md:p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="bg-[#fffbf7] rounded-3xl p-8 md:p-10 shadow-xl mb-8">
                    <div className="flex justify-between items-start mb-4">
                        <div className="text-center flex-1">
                            <h1 className="text-3xl md:text-4xl text-[#5a4a3a] mb-2" style={{ fontFamily: 'var(--font-lora), Lora, serif' }}>
                                Content Performance
                            </h1>
                            <p className="text-[#7a6a5a] text-lg">
                                Track your tweet performance with ease ✨
                            </p>
                        </div>
                        <SettingsPanel
                            categories={settings.categories}
                            types={settings.types}
                            onUpdate={loadSettings}
                        />
                    </div>

                    {/* Tab Navigation */}
                    <div className="flex justify-center gap-4 mt-6">
                        <button
                            onClick={() => setActiveView('analytics')}
                            className="px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
                            style={tabStyle(activeView === 'analytics')}
                        >
                            📊 Analytics
                        </button>
                        <button
                            onClick={() => setActiveView('data-entry')}
                            className="px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
                            style={tabStyle(activeView === 'data-entry')}
                        >
                            ✏️ Data Entry
                        </button>
                    </div>
                </div>

                {/* View Content */}
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
            </div>
        </div>
    );
}
