const https = require('https');

// Sample Tweet ID from the user's data or a known public one
// From file view, I'll grab one. If file view fails, I'll use a known one.
// Let's use a generic one initially: 1616837042578505729 (Example)
// But better to parse one from the file content if possible. 
// I'll grab the first ID from the tweets.json in the next step or hardcode one I see.

async function fetchTweetStats(tweetId) {
    const url = `https://api.react-tweet.vercel.app/tweet/${tweetId}`;

    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    console.log('Status Code:', res.statusCode);
                    console.log('Data:', JSON.stringify(json, null, 2));
                    resolve(json);
                } catch (e) {
                    console.error('Parse Error:', data);
                    reject(e);
                }
            });
        }).on('error', reject);
    });
}

// Test with a known ID if I can't find one yet, or pass one as arg
const id = process.argv[2] || '1883560738361028989'; // Using a random recent tweet ID or one from my memory? 
// Actually, let's use the one from the file I'm about to read.
// I'll update this script content in a second step if I need a specific ID.
// For now, I will use a known safe ID: 1466041249963528198 (Jack's "just setting up my twttr" - actually that's too old maybe?)
// Let's use a random DeFiEdge one if known... 
// I'll use a placeholder and rely on the `view_file` output to give me a real ID to run with.

fetchTweetStats(id);
