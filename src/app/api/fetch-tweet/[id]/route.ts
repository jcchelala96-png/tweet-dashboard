import { NextResponse } from 'next/server';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    const endpoints = [
        `https://cdn.syndication.twimg.com/tweet-result?id=${id}&token=x`,
        `https://api.react-tweet.vercel.app/tweet/${id}`,
    ];

    for (const url of endpoints) {
        try {
            const response = await fetch(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                    'Accept': 'application/json',
                },
                signal: AbortSignal.timeout(5000), // 5 second timeout
            });

            if (response.ok) {
                const data = await response.json();

                // Handle syndication API format
                if (data.favorite_count !== undefined || data.views_count !== undefined) {
                    return NextResponse.json({
                        data: {
                            views: data.views_count || data.views || 0,
                            favorite_count: data.favorite_count || 0,
                            retweet_count: data.retweet_count || 0,
                            reply_count: data.reply_count || 0,
                        }
                    });
                }

                // Handle react-tweet API format
                if (data.data) {
                    return NextResponse.json(data);
                }
            }
        } catch (error) {
            console.log(`Failed to fetch from ${url}:`, error);
            continue; // Try next endpoint
        }
    }

    return NextResponse.json(
        { error: 'Could not fetch tweet stats from any source. Please enter manually.' },
        { status: 503 }
    );
}
