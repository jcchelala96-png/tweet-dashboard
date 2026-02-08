import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { Tweet } from '@/lib/types';

export async function GET() {
    try {
        const { data, error } = await supabase
            .from('tweets')
            .select('*')
            .order('date', { ascending: false });

        if (error) throw error;

        // Transform database rows to Tweet format
        const tweets: Tweet[] = (data || []).map(row => ({
            id: row.id,
            date: row.date,
            category: row.category,
            type: row.type,
            topic: row.topic || '',
            url: row.url,
            metrics: {
                views: row.views || 0,
                likes: row.likes || 0,
                retweets: row.retweets || 0,
                replies: row.replies || 0,
                bookmarks: row.bookmarks || 0
            }
        }));

        return NextResponse.json(tweets);
    } catch (error) {
        console.error('Database Error:', error);
        return NextResponse.json({ error: 'Failed to read data' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body: Partial<Tweet> = await request.json();

        if (!body.url || !body.date) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const newTweet = {
            id: Date.now().toString(),
            date: body.date,
            category: body.category || 'Uncategorized',
            type: body.type || 'Other',
            topic: body.topic || '',
            url: body.url,
            views: Number(body.metrics?.views) || 0,
            likes: Number(body.metrics?.likes) || 0,
            retweets: Number(body.metrics?.retweets) || 0,
            replies: Number(body.metrics?.replies) || 0,
            bookmarks: Number(body.metrics?.bookmarks) || 0
        };

        const { error } = await supabase
            .from('tweets')
            .insert(newTweet);

        if (error) throw error;

        // Return in Tweet format
        const savedTweet: Tweet = {
            id: newTweet.id,
            date: newTweet.date,
            category: newTweet.category,
            type: newTweet.type,
            topic: newTweet.topic,
            url: newTweet.url,
            metrics: {
                views: newTweet.views,
                likes: newTweet.likes,
                retweets: newTweet.retweets,
                replies: newTweet.replies,
                bookmarks: newTweet.bookmarks
            }
        };

        return NextResponse.json(savedTweet);
    } catch (error) {
        console.error('Database Error:', error);
        return NextResponse.json({ error: 'Failed to save data' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const body: Tweet = await request.json();

        if (!body.id) {
            return NextResponse.json({ error: 'Missing tweet ID' }, { status: 400 });
        }

        const updateData = {
            date: body.date,
            category: body.category,
            type: body.type,
            topic: body.topic || '',
            url: body.url,
            views: Number(body.metrics?.views) || 0,
            likes: Number(body.metrics?.likes) || 0,
            retweets: Number(body.metrics?.retweets) || 0,
            replies: Number(body.metrics?.replies) || 0,
            bookmarks: Number(body.metrics?.bookmarks) || 0
        };

        const { error } = await supabase
            .from('tweets')
            .update(updateData)
            .eq('id', body.id);

        if (error) throw error;

        return NextResponse.json(body);
    } catch (error) {
        console.error('Database Error:', error);
        return NextResponse.json({ error: 'Failed to update data' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { id } = await request.json();

        if (!id) {
            return NextResponse.json({ error: 'Missing tweet ID' }, { status: 400 });
        }

        const { error } = await supabase
            .from('tweets')
            .delete()
            .eq('id', id);

        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Database Error:', error);
        return NextResponse.json({ error: 'Failed to delete data' }, { status: 500 });
    }
}
