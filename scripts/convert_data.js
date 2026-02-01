const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');

const inputFile = path.join(__dirname, '..', 'Content Performance.xlsx');
const outputDir = path.join(__dirname, 'src', 'data');
const outputFile = path.join(outputDir, 'tweets.json');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// Read Excel
const workbook = XLSX.readFile(inputFile);
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];

// Parse JSON with raw values to preserve numbers
const rawData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

// Transform data to match our desired interface
const tweets = rawData.map((row, index) => {
    // Basic cleaning and mapping
    return {
        id: index.toString(), // temporary ID
        date: row['Date'] || new Date().toISOString().split('T')[0],
        category: row['Category'] || 'Uncategorized',
        type: row['Type'] || 'Other',
        topic: row['Topic'] || '',
        url: row['URL'] || '',
        metrics: {
            views: Number(row['Views']) || 0,
            likes: Number(row['Likes']) || 0,
            retweets: Number(row['RTs']) || 0,
            replies: Number(row['Replies']) || 0
        }
    };
});

// Write to JSON
fs.writeFileSync(outputFile, JSON.stringify(tweets, null, 2));
console.log(`Converted ${tweets.length} tweets to ${outputFile}`);
