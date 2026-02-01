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

    const buttonStyle = {
        background: 'linear-gradient(135deg, #d4b896 0%, #c4a67a 100%)',
    };

    const buttonHoverStyle = {
        background: 'linear-gradient(135deg, #8b6f47 0%, #6b5237 100%)',
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-[#fffbf7] rounded-3xl p-8 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl text-[#5a4a3a]" style={{ fontFamily: 'var(--font-lora), Lora, serif' }}>
                        Edit Tweet
                    </h2>
                    <button onClick={onClose} className="text-[#7a6a5a] hover:text-[#5a4a3a]">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Date & URL */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-[#5a4a3a] mb-2">Date</label>
                            <input
                                type="date"
                                required
                                className="w-full bg-white border-2 border-[#e0d0c0] rounded-xl px-4 py-3 text-[#5a4a3a] focus:outline-none focus:border-[#8b6f47]"
                                value={formData.date}
                                onChange={e => setFormData({ ...formData, date: e.target.value })}
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-[#5a4a3a] mb-2">Tweet URL</label>
                            <input
                                type="url"
                                required
                                className="w-full bg-white border-2 border-[#e0d0c0] rounded-xl px-4 py-3 text-[#5a4a3a] focus:outline-none focus:border-[#8b6f47]"
                                value={formData.url}
                                onChange={e => setFormData({ ...formData, url: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Category & Type */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-[#5a4a3a] mb-2">Category</label>
                            <select
                                className="w-full bg-white border-2 border-[#e0d0c0] rounded-xl px-4 py-3 text-[#5a4a3a] focus:outline-none focus:border-[#8b6f47] cursor-pointer"
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
                                className="w-full bg-white border-2 border-[#e0d0c0] rounded-xl px-4 py-3 text-[#5a4a3a] focus:outline-none focus:border-[#8b6f47] cursor-pointer"
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
                                        className="w-full bg-white border-2 border-[#e0d0c0] rounded-xl px-4 py-3 text-[#5a4a3a] focus:outline-none focus:border-[#8b6f47]"
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
                            className="px-6 py-3 rounded-xl font-semibold text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
                        >
                            Delete Tweet
                        </button>
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
                            {isSubmitting ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
