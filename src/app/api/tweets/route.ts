import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { Tweet } from '@/lib/types';

const dataPath = path.join(process.cwd(), 'src', 'data', 'tweets.json');

// Ensure data file exists
if (!fs.existsSync(dataPath)) {
    fs.mkdirSync(path.dirname(dataPath), { recursive: true });
    fs.writeFileSync(dataPath, '[]');
}

export async function GET() {
    try {
        const fileContents = fs.readFileSync(dataPath, 'utf8');
        const tweets: Tweet[] = JSON.parse(fileContents);
        return NextResponse.json(tweets);
    } catch (error) {
        console.error('Database Error:', error);
        return NextResponse.json({ error: 'Failed to read data' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body: Partial<Tweet> = await request.json();

        // Basic Validation
        if (!body.url || !body.date) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const fileContents = fs.readFileSync(dataPath, 'utf8');
        const tweets: Tweet[] = JSON.parse(fileContents);

        const newTweet: Tweet = {
            id: Date.now().toString(),
            date: body.date,
            category: body.category || 'Uncategorized',
            type: body.type || 'Other',
            topic: body.topic || '',
            url: body.url,
            metrics: {
                views: Number(body.metrics?.views) || 0,
                likes: Number(body.metrics?.likes) || 0,
                retweets: Number(body.metrics?.retweets) || 0,
                replies: Number(body.metrics?.replies) || 0,
                bookmarks: Number(body.metrics?.bookmarks) || 0
            }
        };

        tweets.unshift(newTweet); // Add to top

        fs.writeFileSync(dataPath, JSON.stringify(tweets, null, 2));

        return NextResponse.json(newTweet);
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

        const fileContents = fs.readFileSync(dataPath, 'utf8');
        const tweets: Tweet[] = JSON.parse(fileContents);

        const index = tweets.findIndex(t => t.id === body.id);
        if (index === -1) {
            return NextResponse.json({ error: 'Tweet not found' }, { status: 404 });
        }

        tweets[index] = {
            ...tweets[index],
            date: body.date,
            category: body.category,
            type: body.type,
            topic: body.topic || '',
            url: body.url,
            metrics: {
                views: Number(body.metrics?.views) || 0,
                likes: Number(body.metrics?.likes) || 0,
                retweets: Number(body.metrics?.retweets) || 0,
                replies: Number(body.metrics?.replies) || 0,
                bookmarks: Number(body.metrics?.bookmarks) || 0
            }
        };

        fs.writeFileSync(dataPath, JSON.stringify(tweets, null, 2));

        return NextResponse.json(tweets[index]);
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

        const fileContents = fs.readFileSync(dataPath, 'utf8');
        let tweets: Tweet[] = JSON.parse(fileContents);

        tweets = tweets.filter(t => t.id !== id);

        fs.writeFileSync(dataPath, JSON.stringify(tweets, null, 2));

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Database Error:', error);
        return NextResponse.json({ error: 'Failed to delete data' }, { status: 500 });
    }
}

