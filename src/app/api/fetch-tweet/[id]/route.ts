import { NextResponse } from 'next/server';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractMetrics(data: any) {
    const views =
        data.views?.count ||
        data.views_count ||
        data.viewCount ||
        (typeof data.views === 'number' ? data.views : 0) ||
        parseInt(data.views) ||
        0;

    const likes =
        data.favorite_count ||
        data.like_count ||
        data.legacy?.favorite_count ||
        0;

    const retweets =
        data.retweet_count ||
        data.retweetCount ||
        data.legacy?.retweet_count ||
        0;

    const replies =
        data.reply_count ||
        data.replyCount ||
        data.legacy?.reply_count ||
        data.conversation_count ||
        0;

    const bookmarks =
        data.bookmark_count ||
        data.bookmarkCount ||
        0;

    return { views, likes, retweets, replies, bookmarks };
}

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
                console.log('Tweet API Response:', JSON.stringify(data, null, 2));

                // Handle syndication API format (top-level metrics)
                if (data.favorite_count !== undefined || data.views_count !== undefined) {
                    const metrics = extractMetrics(data);
                    return NextResponse.json({
                        data: {
                            created_at: data.created_at || null,
                            views: metrics.views,
                            favorite_count: metrics.likes,
                            retweet_count: metrics.retweets,
                            reply_count: metrics.replies,
                            bookmark_count: metrics.bookmarks,
                        }
                    });
                }

                // Handle react-tweet API format (metrics nested under data.data)
                if (data.data) {
                    const tweetData = data.data;
                    const metrics = extractMetrics(tweetData);
                    return NextResponse.json({
                        data: {
                            created_at: tweetData.created_at || null,
                            views: metrics.views,
                            favorite_count: metrics.likes,
                            retweet_count: metrics.retweets,
                            reply_count: metrics.replies,
                            bookmark_count: metrics.bookmarks,
                        }
                    });
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
