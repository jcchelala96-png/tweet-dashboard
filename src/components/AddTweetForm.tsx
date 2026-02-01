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

    const buttonStyle = {
        background: 'linear-gradient(135deg, #d4b896 0%, #c4a67a 100%)',
    };

    const buttonHoverStyle = {
        background: 'linear-gradient(135deg, #8b6f47 0%, #6b5237 100%)',
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="w-full py-4 px-6 rounded-xl text-lg font-semibold text-[#4a3a2a] transition-all duration-200 hover:text-white hover:-translate-y-0.5 hover:shadow-lg"
                style={buttonStyle}
                onMouseEnter={(e) => {
                    Object.assign(e.currentTarget.style, buttonHoverStyle);
                }}
                onMouseLeave={(e) => {
                    Object.assign(e.currentTarget.style, buttonStyle);
                }}
            >
                + Add New Tweet
            </button>
        );
    }

    return (
        <div className="bg-[#fffbf7] rounded-3xl p-8 shadow-xl">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-2xl text-[#5a4a3a]" style={{ fontFamily: 'var(--font-lora), Lora, serif' }}>
                        Add New Tweet
                    </h3>
                    <p className="text-sm text-[#7a6a5a] mt-1">Track your content performance</p>
                </div>
                <button
                    onClick={() => setIsOpen(false)}
                    className="text-[#7a6a5a] hover:text-[#5a4a3a] transition-colors px-3 py-1 rounded-lg hover:bg-[#f5e6d3]"
                >
                    Cancel
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Date & URL Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-[#5a4a3a] mb-2">Date</label>
                        <input
                            type="date"
                            required
                            className="w-full bg-white border-2 border-[#e0d0c0] rounded-xl px-4 py-3 text-[#5a4a3a] focus:outline-none focus:border-[#8b6f47] transition-all"
                            value={formData.date}
                            onChange={e => setFormData({ ...formData, date: e.target.value })}
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-[#5a4a3a] mb-2">Tweet URL</label>
                        <div className="flex gap-3">
                            <input
                                type="url"
                                required
                                placeholder="https://x.com/..."
                                className="flex-1 bg-white border-2 border-[#e0d0c0] rounded-xl px-4 py-3 text-[#5a4a3a] placeholder-[#b0a090] focus:outline-none focus:border-[#8b6f47] transition-all"
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
                                className="px-5 py-3 rounded-xl font-semibold text-[#4a3a2a] transition-all duration-200 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
                                style={buttonStyle}
                                onMouseEnter={(e) => {
                                    if (!e.currentTarget.disabled) Object.assign(e.currentTarget.style, buttonHoverStyle);
                                }}
                                onMouseLeave={(e) => {
                                    Object.assign(e.currentTarget.style, buttonStyle);
                                }}
                            >
                                {isFetching ? 'Fetching...' : 'Fetch'}
                            </button>
                        </div>
                        {fetchError && (
                            <p className="text-sm text-[#8b6f47] mt-2">{fetchError}</p>
                        )}
                    </div>
                </div>

                {/* Category & Type */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-[#5a4a3a] mb-2">Category</label>
                        <select
                            className="w-full bg-white border-2 border-[#e0d0c0] rounded-xl px-4 py-3 text-[#5a4a3a] focus:outline-none focus:border-[#8b6f47] transition-all cursor-pointer"
                            value={formData.category}
                            onChange={e => setFormData({ ...formData, category: e.target.value })}
                        >
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-[#5a4a3a] mb-2">Type</label>
                        <select
                            className="w-full bg-white border-2 border-[#e0d0c0] rounded-xl px-4 py-3 text-[#5a4a3a] focus:outline-none focus:border-[#8b6f47] transition-all cursor-pointer"
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
                    <label className="block text-sm font-medium text-[#5a4a3a] mb-3">Metrics</label>
                    <div className="grid grid-cols-5 gap-4">
                        {['views', 'likes', 'retweets', 'replies', 'bookmarks'].map((metric) => (
                            <div key={metric}>
                                <label className="block text-xs text-[#7a6a5a] mb-1.5 capitalize">{metric}</label>
                                <input
                                    type="number"
                                    min="0"
                                    className="w-full bg-white border-2 border-[#e0d0c0] rounded-xl px-4 py-3 text-[#5a4a3a] focus:outline-none focus:border-[#8b6f47] transition-all"
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
                        className="px-8 py-3 rounded-xl text-lg font-semibold text-[#4a3a2a] transition-all duration-200 hover:text-white hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50"
                        style={buttonStyle}
                        onMouseEnter={(e) => {
                            if (!e.currentTarget.disabled) Object.assign(e.currentTarget.style, buttonHoverStyle);
                        }}
                        onMouseLeave={(e) => {
                            Object.assign(e.currentTarget.style, buttonStyle);
                        }}
                    >
                        {isSubmitting ? 'Saving...' : 'Save Tweet'}
                    </button>
                </div>
            </form>
        </div>
    );
}
