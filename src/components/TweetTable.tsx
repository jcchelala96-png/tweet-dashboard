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
            <div className="card" style={{ background: 'var(--background-card)', overflow: 'hidden' }}>
                {/* Table Header */}
                <div className="px-6 py-4 border-b" style={{ borderColor: 'var(--border-subtle)', background: 'var(--background-elevated)' }}>
                    <h2 className="text-xl font-semibold" style={{ color: 'var(--foreground)' }}>
                        Recent Tweets
                    </h2>
                    <p className="text-sm" style={{ color: 'var(--foreground-muted)' }}>{tweets.length} tweets tracked</p>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead style={{ background: 'var(--background-elevated)', borderBottom: '1px solid var(--border-subtle)' }}>
                            <tr>
                                <th className="px-4 py-4 font-semibold text-xs uppercase tracking-wider" style={{ color: 'var(--foreground-muted)' }}>Date</th>
                                <th className="px-4 py-4 font-semibold text-xs uppercase tracking-wider" style={{ color: 'var(--foreground-muted)' }}>Tweet</th>
                                <th className="px-4 py-4 font-semibold text-xs uppercase tracking-wider" style={{ color: 'var(--foreground-muted)' }}>Category</th>
                                <th className="px-4 py-4 font-semibold text-xs uppercase tracking-wider text-center" style={{ color: 'var(--foreground-muted)' }}>Views</th>
                                <th className="px-4 py-4 font-semibold text-xs uppercase tracking-wider text-center" style={{ color: 'var(--foreground-muted)' }}>Likes</th>
                                <th className="px-4 py-4 font-semibold text-xs uppercase tracking-wider text-center" style={{ color: 'var(--foreground-muted)' }}>RTs</th>
                                <th className="px-4 py-4 font-semibold text-xs uppercase tracking-wider text-center" style={{ color: 'var(--foreground-muted)' }}>Replies</th>
                                <th className="px-4 py-4 font-semibold text-xs uppercase tracking-wider text-center" style={{ color: 'var(--foreground-muted)' }}>Bookmarks</th>
                                <th className="px-4 py-4 font-semibold text-xs uppercase tracking-wider text-center" style={{ color: 'var(--foreground-muted)' }}>Edit</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tweets.map((tweet) => (
                                <tr
                                    key={tweet.id}
                                    className="transition-colors hover:bg-[var(--background-elevated)]"
                                    style={{ borderBottom: '1px solid var(--border-subtle)' }}
                                >
                                    <td className="px-4 py-4 whitespace-nowrap">
                                        <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                                            {tweet.date}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4 max-w-xs">
                                        <a
                                            href={tweet.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 transition-colors hover:underline"
                                            style={{ color: 'var(--accent-primary)' }}
                                        >
                                            <span className="truncate">{tweet.url}</span>
                                            <ExternalLink className="w-3 h-3 flex-shrink-0" />
                                        </a>
                                        {tweet.type && tweet.type !== 'Other' && (
                                            <span className="pill inline-block mt-1 text-xs">
                                                {tweet.type}
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-4 py-4">
                                        <span className="pill">{tweet.category}</span>
                                    </td>
                                    <td className="px-4 py-4 text-center">
                                        <span className="font-bold" style={{ color: 'var(--accent-primary)' }}>{tweet.metrics.views.toLocaleString()}</span>
                                    </td>
                                    <td className="px-4 py-4 text-center">
                                        <span style={{ color: 'var(--foreground)' }}>{tweet.metrics.likes.toLocaleString()}</span>
                                    </td>
                                    <td className="px-4 py-4 text-center">
                                        <span style={{ color: 'var(--foreground)' }}>{tweet.metrics.retweets.toLocaleString()}</span>
                                    </td>
                                    <td className="px-4 py-4 text-center">
                                        <span style={{ color: 'var(--foreground)' }}>{tweet.metrics.replies.toLocaleString()}</span>
                                    </td>
                                    <td className="px-4 py-4 text-center">
                                        <span style={{ color: 'var(--foreground)' }}>{(tweet.metrics.bookmarks || 0).toLocaleString()}</span>
                                    </td>
                                    <td className="px-4 py-4 text-center">
                                        <button
                                            onClick={() => setEditingTweet(tweet)}
                                            className="p-2 rounded-lg transition-colors"
                                            style={{ color: 'var(--foreground-muted)' }}
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
                                        <p className="text-lg" style={{ color: 'var(--foreground-muted)' }}>No tweets tracked yet</p>
                                        <p className="text-sm mt-1" style={{ color: 'var(--foreground-subtle)' }}>Add your first tweet above to get started ✨</p>
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

