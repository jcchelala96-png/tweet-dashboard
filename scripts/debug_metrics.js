const TWEET_ID = process.argv[2] || '2015038557333999944';

async function debugEndpoint(name, url) {
    console.log(`\n=== ${name} ===`);
    console.log(`URL: ${url}`);
    try {
        const res = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept': 'application/json',
            }
        });
        console.log(`Status: ${res.status}`);
        if (!res.ok) {
            console.log('Response text:', await res.text());
            return null;
        }
        const json = await res.json();
        console.log('Full response:', JSON.stringify(json, null, 2));
        return json;
    } catch (e) {
        console.error('Error:', e.message);
        return null;
    }
}

function inspectMetrics(label, data) {
    if (!data) return;
    console.log(`\n--- ${label} Metrics Inspection ---`);
    console.log('typeof data.views:', typeof data.views);
    console.log('data.views:', JSON.stringify(data.views));
    console.log('data.views?.count:', data.views?.count);
    console.log('data.views_count:', data.views_count);
    console.log('data.viewCount:', data.viewCount);
    console.log('data.favorite_count:', data.favorite_count);
    console.log('data.like_count:', data.like_count);
    console.log('data.retweet_count:', data.retweet_count);
    console.log('data.retweetCount:', data.retweetCount);
    console.log('data.reply_count:', data.reply_count);
    console.log('data.replyCount:', data.replyCount);
    console.log('data.conversation_count:', data.conversation_count);
    console.log('data.bookmark_count:', data.bookmark_count);
    console.log('data.bookmarkCount:', data.bookmarkCount);
    console.log('All top-level keys:', Object.keys(data));
}

(async () => {
    const synd = await debugEndpoint(
        'Syndication API',
        `https://cdn.syndication.twimg.com/tweet-result?id=${TWEET_ID}&token=x`
    );
    if (synd) inspectMetrics('Syndication', synd);

    const rt = await debugEndpoint(
        'React-Tweet API',
        `https://api.react-tweet.vercel.app/tweet/${TWEET_ID}`
    );
    if (rt) {
        inspectMetrics('React-Tweet (root)', rt);
        if (rt.data) inspectMetrics('React-Tweet (data)', rt.data);
    }
})();
