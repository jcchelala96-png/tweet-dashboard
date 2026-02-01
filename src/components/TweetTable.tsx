'use client';

import { useState } from 'react';
import { Tweet } from '@/lib/types';
import { ExternalLink, Pencil } from 'lucide-react';
import { EditTweetModal } from './EditTweetModal';

interface TweetTableProps {
    tweets: Tweet[];
    categories: string[];
    types: string[];
    onUpdate: (updatedTweet: Tweet) => void;
    onDelete: (id: string) => void;
}

export function TweetTable({ tweets, categories, types, onUpdate, onDelete }: TweetTableProps) {
    const [editingTweet, setEditingTweet] = useState<Tweet | null>(null);

    return (
        <>
            <div className="bg-[#fffbf7] rounded-3xl shadow-xl overflow-hidden">
                {/* Table Header */}
                <div className="bg-[#f5e6d3] px-6 py-4 border-b border-[#e0d0c0]">
                    <h2 className="text-xl text-[#5a4a3a]" style={{ fontFamily: 'var(--font-lora), Lora, serif' }}>
                        Recent Tweets
                    </h2>
                    <p className="text-sm text-[#7a6a5a]">{tweets.length} tweets tracked</p>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-[#faf5f0] text-[#7a6a5a] text-xs uppercase tracking-wider border-b border-[#e0d0c0]">
                            <tr>
                                <th className="px-4 py-4 font-semibold">Date</th>
                                <th className="px-4 py-4 font-semibold">Tweet</th>
                                <th className="px-4 py-4 font-semibold">Category</th>
                                <th className="px-4 py-4 font-semibold text-center">Views</th>
                                <th className="px-4 py-4 font-semibold text-center">Likes</th>
                                <th className="px-4 py-4 font-semibold text-center">RTs</th>
                                <th className="px-4 py-4 font-semibold text-center">Replies</th>
                                <th className="px-4 py-4 font-semibold text-center">Bookmarks</th>
                                <th className="px-4 py-4 font-semibold text-center">Edit</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#f0e5da]">
                            {tweets.map((tweet) => (
                                <tr key={tweet.id} className="hover:bg-[#faf5f0] transition-colors">
                                    <td className="px-4 py-4 whitespace-nowrap">
                                        <span className="text-[#5a4a3a] text-sm font-medium">
                                            {tweet.date}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4 max-w-xs">
                                        <a
                                            href={tweet.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 text-[#8b6f47] hover:text-[#6b5237] transition-colors hover:underline"
                                        >
                                            <span className="truncate">{tweet.url}</span>
                                            <ExternalLink className="w-3 h-3 flex-shrink-0" />
                                        </a>
                                        {tweet.type && tweet.type !== 'Other' && (
                                            <span className="inline-block mt-1 text-xs bg-[#f5e6d3] text-[#7a6a5a] px-2 py-0.5 rounded-full">
                                                {tweet.type}
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-4 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold
                                            ${tweet.category === 'Education'
                                                ? 'bg-[#d4edda] text-[#155724]'
                                                : tweet.category === 'Personal'
                                                    ? 'bg-[#e2d4f0] text-[#5a3e85]'
                                                    : tweet.category === 'Promotion'
                                                        ? 'bg-[#fff3cd] text-[#856404]'
                                                        : 'bg-[#f5e6d3] text-[#5a4a3a]'}`}>
                                            {tweet.category}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4 text-center">
                                        <span className="font-bold text-[#8b6f47]">{tweet.metrics.views.toLocaleString()}</span>
                                    </td>
                                    <td className="px-4 py-4 text-center">
                                        <span className="text-[#5a4a3a]">{tweet.metrics.likes.toLocaleString()}</span>
                                    </td>
                                    <td className="px-4 py-4 text-center">
                                        <span className="text-[#5a4a3a]">{tweet.metrics.retweets.toLocaleString()}</span>
                                    </td>
                                    <td className="px-4 py-4 text-center">
                                        <span className="text-[#5a4a3a]">{tweet.metrics.replies.toLocaleString()}</span>
                                    </td>
                                    <td className="px-4 py-4 text-center">
                                        <span className="text-[#5a4a3a]">{(tweet.metrics.bookmarks || 0).toLocaleString()}</span>
                                    </td>
                                    <td className="px-4 py-4 text-center">
                                        <button
                                            onClick={() => setEditingTweet(tweet)}
                                            className="p-2 rounded-lg text-[#7a6a5a] hover:text-[#8b6f47] hover:bg-[#f5e6d3] transition-colors"
                                            title="Edit tweet"
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {tweets.length === 0 && (
                                <tr>
                                    <td colSpan={9} className="px-6 py-16 text-center">
                                        <p className="text-[#7a6a5a] text-lg">No tweets tracked yet</p>
                                        <p className="text-[#a89b8c] text-sm mt-1">Add your first tweet above to get started ✨</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Edit Modal */}
            {editingTweet && (
                <EditTweetModal
                    tweet={editingTweet}
                    categories={categories}
                    types={types}
                    onSave={onUpdate}
                    onDelete={onDelete}
                    onClose={() => setEditingTweet(null)}
                />
            )}
        </>
    );
}
