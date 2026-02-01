'use client';

import { Tweet } from '@/lib/types';
import { TweetTable } from './TweetTable';
import { AddTweetForm } from './AddTweetForm';

interface DataEntryViewProps {
    tweets: Tweet[];
    onAdd: (tweet: Tweet) => void;
    onUpdate: (tweet: Tweet) => void;
    onDelete: (id: string) => void;
    categories: string[];
    types: string[];
}

export function DataEntryView({ tweets, onAdd, onUpdate, onDelete, categories, types }: DataEntryViewProps) {
    return (
        <div className="space-y-8">
            {/* Add Form */}
            <AddTweetForm onAdd={onAdd} categories={categories} types={types} />

            {/* Table */}
            <TweetTable
                tweets={tweets}
                categories={categories}
                types={types}
                onUpdate={onUpdate}
                onDelete={onDelete}
            />
        </div>
    );
}
