'use client';

import { useState } from 'react';
import { Tweet } from '@/lib/types';

interface AddTweetFormProps {
    onAdd: (tweet: Tweet) => void;
    categories: string[];
    types: string[];
}

function extractTweetId(url: string): string | null {
    const match = url.match(/status\/(\d+)/);
    return match ? match[1] : null;
}

export function AddTweetForm({ onAdd, categories, types }: AddTweetFormProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const [fetchError, setFetchError] = useState<string | null>(null);
    const [formData, setFormData] = useState<Partial<Tweet>>({
        date: new Date().toISOString().split('T')[0],
        category: categories[0] || 'Education',
        type: types[0] || 'Thread',
        metrics: { views: 0, likes: 0, retweets: 0, replies: 0, bookmarks: 0 }
    });

    const handleAutoFetch = async () => {
        if (!formData.url) {
            setFetchError('Please enter a tweet URL first');
            return;
        }

        const tweetId = extractTweetId(formData.url);
        if (!tweetId) {
            setFetchError('Could not extract tweet ID from URL');
            return;
        }

        setIsFetching(true);
        setFetchError(null);

        try {
            const response = await fetch(`/api/fetch-tweet/${tweetId}`);

            if (!response.ok) {
                throw new Error('Tweet not found or API unavailable');
            }

            const result = await response.json();

            if (result.data) {
                setFormData(prev => ({
                    ...prev,
                    date: result.data.created_at
                        ? new Date(result.data.created_at).toISOString().split('T')[0]
                        : prev.date,
                    metrics: {
                        views: result.data.views || 0,
                        likes: result.data.favorite_count || 0,
                        retweets: result.data.retweet_count || 0,
                        replies: result.data.reply_count || 0,
                        bookmarks: result.data.bookmark_count || 0
                    }
                }));
            } else {
                throw new Error('No data received');
            }
        } catch {
            setFetchError('Could not fetch stats. Enter them manually.');
        } finally {
            setIsFetching(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch('/api/tweets', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!response.ok) throw new Error('Failed to save');

            const savedTweet = await response.json();
            onAdd(savedTweet);
            setIsOpen(false);
            setFormData(prev => ({
                ...prev,
                url: '',
                topic: '',
                metrics: { views: 0, likes: 0, retweets: 0, replies: 0, bookmarks: 0 }
            }));
            setFetchError(null);
        } catch {
            alert('Error saving tweet');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="w-full py-4 px-6 rounded-xl text-lg font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
                style={{
                    background: 'var(--accent-primary)',
                    color: 'white',
                }}
            >
                + Add New Tweet
            </button>
        );
    }

    return (
        <div className="card" style={{ background: 'var(--background-card)' }}>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-2xl font-semibold" style={{ color: 'var(--foreground)' }}>
                        Add New Tweet
                    </h3>
                    <p className="text-sm mt-1" style={{ color: 'var(--foreground-muted)' }}>Track your content performance</p>
                </div>
                <button
                    onClick={() => setIsOpen(false)}
                    className="px-3 py-1 rounded-lg transition-colors"
                    style={{ color: 'var(--foreground-muted)' }}
                >
                    Cancel
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Date & URL Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground-muted)' }}>Date</label>
                        <input
                            type="date"
                            required
                            className="w-full rounded-xl px-4 py-3 focus:outline-none transition-all"
                            style={{
                                background: 'var(--background-elevated)',
                                border: '1px solid var(--border-subtle)',
                                color: 'var(--foreground)',
                            }}
                            value={formData.date}
                            onChange={e => setFormData({ ...formData, date: e.target.value })}
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground-muted)' }}>Tweet URL</label>
                        <div className="flex gap-3">
                            <input
                                type="url"
                                required
                                placeholder="https://x.com/..."
                                className="flex-1 rounded-xl px-4 py-3 focus:outline-none transition-all"
                                style={{
                                    background: 'var(--background-elevated)',
                                    border: '1px solid var(--border-subtle)',
                                    color: 'var(--foreground)',
                                }}
                                value={formData.url || ''}
                                onChange={e => {
                                    setFormData({ ...formData, url: e.target.value });
                                    setFetchError(null);
                                }}
                            />
                            <button
                                type="button"
                                onClick={handleAutoFetch}
                                disabled={isFetching || !formData.url}
                                className="px-5 py-3 rounded-xl font-semibold transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                                style={{
                                    background: 'var(--accent-primary)',
                                    color: 'white',
                                }}
                            >
                                {isFetching ? 'Fetching...' : 'Fetch'}
                            </button>
                        </div>
                        {fetchError && (
                            <p className="text-sm mt-2" style={{ color: 'var(--accent-warning)' }}>{fetchError}</p>
                        )}
                    </div>
                </div>

                {/* Category & Type */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground-muted)' }}>Category</label>
                        <select
                            className="w-full rounded-xl px-4 py-3 focus:outline-none transition-all cursor-pointer"
                            style={{
                                background: 'var(--background-elevated)',
                                border: '1px solid var(--border-subtle)',
                                color: 'var(--foreground)',
                            }}
                            value={formData.category}
                            onChange={e => setFormData({ ...formData, category: e.target.value })}
                        >
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground-muted)' }}>Type</label>
                        <select
                            className="w-full rounded-xl px-4 py-3 focus:outline-none transition-all cursor-pointer"
                            style={{
                                background: 'var(--background-elevated)',
                                border: '1px solid var(--border-subtle)',
                                color: 'var(--foreground)',
                            }}
                            value={formData.type}
                            onChange={e => setFormData({ ...formData, type: e.target.value })}
                        >
                            {types.map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Metrics */}
                <div>
                    <label className="block text-sm font-medium mb-3" style={{ color: 'var(--foreground-muted)' }}>Metrics</label>
                    <div className="grid grid-cols-5 gap-4">
                        {['views', 'likes', 'retweets', 'replies', 'bookmarks'].map((metric) => (
                            <div key={metric}>
                                <label className="block text-xs mb-1.5 capitalize" style={{ color: 'var(--foreground-subtle)' }}>{metric}</label>
                                <input
                                    type="number"
                                    min="0"
                                    className="w-full rounded-xl px-4 py-3 focus:outline-none transition-all"
                                    style={{
                                        background: 'var(--background-elevated)',
                                        border: '1px solid var(--border-subtle)',
                                        color: 'var(--foreground)',
                                    }}
                                    value={formData.metrics?.[metric as keyof typeof formData.metrics]}
                                    onChange={e => setFormData({
                                        ...formData,
                                        metrics: { ...formData.metrics!, [metric]: parseInt(e.target.value) || 0 }
                                    })}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Submit */}
                <div className="flex justify-end pt-2">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-8 py-3 rounded-xl text-lg font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50"
                        style={{
                            background: 'var(--accent-primary)',
                            color: 'white',
                        }}
                    >
                        {isSubmitting ? 'Saving...' : 'Save Tweet'}
                    </button>
                </div>
            </form>
        </div>
    );
}

