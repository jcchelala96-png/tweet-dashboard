async function testConnection() {
    try {
        console.log('Testing Google...');
        const resGoogle = await fetch('https://www.google.com');
        console.log('Google Status:', resGoogle.status);

        console.log('Testing React Tweet API...');
        const id = '1749814440011530416';
        const resTw = await fetch(`https://api.react-tweet.vercel.app/tweet/${id}`);
        console.log('API Status:', resTw.status);
        if (resTw.ok) {
            const json = await resTw.json();
            console.log('Tweet Data Found:', json.data?.id);
            console.log('Metrics:', json.data?.public_metrics);
        } else {
            console.log('API Text:', await resTw.text());
        }
    } catch (error) {
        console.error('Fetch Error:', error);
    }
}

testConnection();
