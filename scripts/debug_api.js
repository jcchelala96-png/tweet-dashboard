async function testTweetFetch() {
    const tweetId = '1749814440011530416';

    console.log('Testing syndication API...');
    try {
        const res = await fetch(`https://cdn.syndication.twimg.com/tweet-result?id=${tweetId}&token=x`);
        console.log('Status:', res.status);
        const text = await res.text();
        console.log('Response:', text.substring(0, 500));
    } catch (e) {
        console.error('Syndication Error:', e);
    }

    console.log('\nTesting react-tweet API...');
    try {
        const res = await fetch(`https://api.react-tweet.vercel.app/tweet/${tweetId}`);
        console.log('Status:', res.status);
        const text = await res.text();
        console.log('Response:', text.substring(0, 500));
    } catch (e) {
        console.error('React-tweet Error:', e);
    }
}

testTweetFetch();
