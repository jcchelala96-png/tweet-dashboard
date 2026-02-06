'use client';

import { useState } from 'react';
import { Tweet } from '@/lib/types';
import { X } from 'lucide-react';

interface EditTweetModalProps {
    tweet: Tweet;
    categories: string[];
    types: string[];
    onSave: (updatedTweet: Tweet) => void;
    onDelete: (id: string) => void;
    onClose: () => void;
}

export function EditTweetModal({ tweet, categories, types, onSave, onDelete, onClose }: EditTweetModalProps) {
    const [formData, setFormData] = useState<Tweet>({ ...tweet });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch('/api/tweets', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!response.ok) throw new Error('Failed to update');

            const updatedTweet = await response.json();
            onSave(updatedTweet);
            onClose();
        } catch {
            alert('Error updating tweet');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this tweet?')) return;

        try {
            const response = await fetch('/api/tweets', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: tweet.id }),
            });

            if (!response.ok) throw new Error('Failed to delete');

            onDelete(tweet.id);
            onClose();
        } catch {
            alert('Error deleting tweet');
        }
    };

    const inputStyle = {
        background: 'var(--background-elevated)',
        border: '1px solid var(--border-subtle)',
        color: 'var(--foreground)',
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div
                className="card max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                style={{ background: 'var(--background-card)' }}
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold" style={{ color: 'var(--foreground)' }}>
                        Edit Tweet
                    </h2>
                    <button onClick={onClose} style={{ color: 'var(--foreground-muted)' }}>
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Date & URL */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground-muted)' }}>Date</label>
                            <input
                                type="date"
                                required
                                className="w-full rounded-xl px-4 py-3 focus:outline-none transition-all"
                                style={inputStyle}
                                value={formData.date}
                                onChange={e => setFormData({ ...formData, date: e.target.value })}
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground-muted)' }}>Tweet URL</label>
                            <input
                                type="url"
                                required
                                className="w-full rounded-xl px-4 py-3 focus:outline-none transition-all"
                                style={inputStyle}
                                value={formData.url}
                                onChange={e => setFormData({ ...formData, url: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Category & Type */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground-muted)' }}>Category</label>
                            <select
                                className="w-full rounded-xl px-4 py-3 focus:outline-none transition-all cursor-pointer"
                                style={inputStyle}
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
                                style={inputStyle}
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
                                        style={inputStyle}
                                        value={formData.metrics[metric as keyof typeof formData.metrics] || 0}
                                        onChange={e => setFormData({
                                            ...formData,
                                            metrics: { ...formData.metrics, [metric]: parseInt(e.target.value) || 0 }
                                        })}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-between pt-4">
                        <button
                            type="button"
                            onClick={handleDelete}
                            className="px-6 py-3 rounded-xl font-semibold transition-colors"
                            style={{
                                background: 'rgba(239, 68, 68, 0.15)',
                                color: 'var(--accent-danger)',
                            }}
                        >
                            Delete Tweet
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-8 py-3 rounded-xl text-lg font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50"
                            style={{
                                background: 'var(--accent-primary)',
                                color: 'white',
                            }}
                        >
                            {isSubmitting ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

