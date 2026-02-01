import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

interface Settings {
    categories: string[];
    types: string[];
}

const settingsPath = path.join(process.cwd(), 'src', 'data', 'settings.json');

function getSettings(): Settings {
    if (!fs.existsSync(settingsPath)) {
        const defaultSettings = { categories: ['Education', 'Personal', 'Promotion', 'News'], types: ['Thread', 'Tweet', 'Video', 'Quote'] };
        fs.writeFileSync(settingsPath, JSON.stringify(defaultSettings, null, 2));
        return defaultSettings;
    }
    return JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
}

function saveSettings(settings: Settings) {
    fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
}

export async function GET() {
    try {
        const settings = getSettings();
        return NextResponse.json(settings);
    } catch (error) {
        console.error('Settings Error:', error);
        return NextResponse.json({ error: 'Failed to read settings' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const settings = getSettings();

        if (body.action === 'add-category' && body.value) {
            if (!settings.categories.includes(body.value)) {
                settings.categories.push(body.value);
            }
        } else if (body.action === 'remove-category' && body.value) {
            settings.categories = settings.categories.filter(c => c !== body.value);
        } else if (body.action === 'add-type' && body.value) {
            if (!settings.types.includes(body.value)) {
                settings.types.push(body.value);
            }
        } else if (body.action === 'remove-type' && body.value) {
            settings.types = settings.types.filter(t => t !== body.value);
        }

        saveSettings(settings);
        return NextResponse.json(settings);
    } catch (error) {
        console.error('Settings Error:', error);
        return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
    }
}
