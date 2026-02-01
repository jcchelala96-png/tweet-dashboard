'use client';

import { useState } from 'react';
import { X, Plus, Settings } from 'lucide-react';

interface SettingsPanelProps {
    categories: string[];
    types: string[];
    onUpdate: () => void;
}

export function SettingsPanel({ categories, types, onUpdate }: SettingsPanelProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [newCategory, setNewCategory] = useState('');
    const [newType, setNewType] = useState('');

    const handleAdd = async (action: 'add-category' | 'add-type', value: string) => {
        if (!value.trim()) return;
        await fetch('/api/settings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action, value: value.trim() }),
        });
        if (action === 'add-category') setNewCategory('');
        else setNewType('');
        onUpdate();
    };

    const handleRemove = async (action: 'remove-category' | 'remove-type', value: string) => {
        await fetch('/api/settings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action, value }),
        });
        onUpdate();
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-[#7a6a5a] bg-[#f5e6d3] hover:bg-[#e8d4c4] transition-colors"
            >
                <Settings className="w-4 h-4" />
                Settings
            </button>
        );
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setIsOpen(false)}>
            <div className="bg-[#fffbf7] rounded-3xl p-8 max-w-lg w-full shadow-2xl" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl text-[#5a4a3a]" style={{ fontFamily: 'var(--font-lora), Lora, serif' }}>
                        Settings
                    </h2>
                    <button onClick={() => setIsOpen(false)} className="text-[#7a6a5a] hover:text-[#5a4a3a]">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Categories */}
                <div className="mb-6">
                    <h3 className="text-sm font-semibold text-[#5a4a3a] mb-3 uppercase tracking-wider">Categories</h3>
                    <div className="flex flex-wrap gap-2 mb-3">
                        {categories.map(cat => (
                            <span key={cat} className="flex items-center gap-1 px-3 py-1 bg-[#f5e6d3] text-[#5a4a3a] rounded-full text-sm">
                                {cat}
                                <button onClick={() => handleRemove('remove-category', cat)} className="ml-1 hover:text-red-600">
                                    <X className="w-3 h-3" />
                                </button>
                            </span>
                        ))}
                    </div>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="New category..."
                            value={newCategory}
                            onChange={e => setNewCategory(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleAdd('add-category', newCategory)}
                            className="flex-1 bg-white border-2 border-[#e0d0c0] rounded-xl px-3 py-2 text-[#5a4a3a] text-sm focus:outline-none focus:border-[#8b6f47]"
                        />
                        <button
                            onClick={() => handleAdd('add-category', newCategory)}
                            className="px-3 py-2 bg-[#8b6f47] text-white rounded-xl hover:bg-[#6b5237] transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Types */}
                <div>
                    <h3 className="text-sm font-semibold text-[#5a4a3a] mb-3 uppercase tracking-wider">Types</h3>
                    <div className="flex flex-wrap gap-2 mb-3">
                        {types.map(type => (
                            <span key={type} className="flex items-center gap-1 px-3 py-1 bg-[#f5e6d3] text-[#5a4a3a] rounded-full text-sm">
                                {type}
                                <button onClick={() => handleRemove('remove-type', type)} className="ml-1 hover:text-red-600">
                                    <X className="w-3 h-3" />
                                </button>
                            </span>
                        ))}
                    </div>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="New type..."
                            value={newType}
                            onChange={e => setNewType(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleAdd('add-type', newType)}
                            className="flex-1 bg-white border-2 border-[#e0d0c0] rounded-xl px-3 py-2 text-[#5a4a3a] text-sm focus:outline-none focus:border-[#8b6f47]"
                        />
                        <button
                            onClick={() => handleAdd('add-type', newType)}
                            className="px-3 py-2 bg-[#8b6f47] text-white rounded-xl hover:bg-[#6b5237] transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
