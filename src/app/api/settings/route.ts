import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

interface Settings {
    categories: string[];
    types: string[];
}

export async function GET() {
    try {
        const { data, error } = await supabase
            .from('settings')
            .select('categories, types')
            .eq('id', 1)
            .single();

        if (error) throw error;

        const settings: Settings = {
            categories: data?.categories || ['Sponsored', 'Organic'],
            types: data?.types || ['Education', 'Personal', 'News', 'Thread']
        };

        return NextResponse.json(settings);
    } catch (error) {
        console.error('Settings Error:', error);
        return NextResponse.json({ error: 'Failed to read settings' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Get current settings
        const { data: currentData, error: fetchError } = await supabase
            .from('settings')
            .select('categories, types')
            .eq('id', 1)
            .single();

        if (fetchError) throw fetchError;

        const settings: Settings = {
            categories: currentData?.categories || [],
            types: currentData?.types || []
        };

        // Apply action
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

        // Save updated settings
        const { error: updateError } = await supabase
            .from('settings')
            .update({
                categories: settings.categories,
                types: settings.types
            })
            .eq('id', 1);

        if (updateError) throw updateError;

        return NextResponse.json(settings);
    } catch (error) {
        console.error('Settings Error:', error);
        return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
    }
}
