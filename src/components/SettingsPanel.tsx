'use client';

import { useState } from 'react';
import { createPortal } from 'react-dom';
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

    const inputStyle = {
        background: 'var(--background-elevated)',
        border: '1px solid var(--border-subtle)',
        color: 'var(--foreground)',
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors"
                style={{
                    color: 'var(--foreground-muted)',
                    border: '1px solid var(--border-subtle)',
                }}
            >
                <Settings className="w-4 h-4" />
                Settings
            </button>
        );
    }

    return createPortal(
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto" onClick={() => setIsOpen(false)}>
            <div
                className="card max-w-lg w-full my-auto"
                style={{ background: 'var(--background-card)' }}
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold" style={{ color: 'var(--foreground)' }}>
                        Settings
                    </h2>
                    <button onClick={() => setIsOpen(false)} style={{ color: 'var(--foreground-muted)' }}>
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Categories */}
                <div className="mb-6">
                    <h3 className="text-sm font-semibold mb-3 uppercase tracking-wider" style={{ color: 'var(--foreground-muted)' }}>Categories</h3>
                    <div className="flex flex-wrap gap-2 mb-3">
                        {categories.map(cat => (
                            <span key={cat} className="pill flex items-center gap-1">
                                {cat}
                                <button onClick={() => handleRemove('remove-category', cat)} className="ml-1" style={{ color: 'var(--accent-danger)' }}>
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
                            className="flex-1 rounded-xl px-3 py-2 text-sm focus:outline-none"
                            style={inputStyle}
                        />
                        <button
                            onClick={() => handleAdd('add-category', newCategory)}
                            className="px-3 py-2 rounded-xl transition-colors"
                            style={{ background: 'var(--accent-primary)', color: 'white' }}
                        >
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Types */}
                <div>
                    <h3 className="text-sm font-semibold mb-3 uppercase tracking-wider" style={{ color: 'var(--foreground-muted)' }}>Types</h3>
                    <div className="flex flex-wrap gap-2 mb-3">
                        {types.map(type => (
                            <span key={type} className="pill flex items-center gap-1">
                                {type}
                                <button onClick={() => handleRemove('remove-type', type)} className="ml-1" style={{ color: 'var(--accent-danger)' }}>
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
                            className="flex-1 rounded-xl px-3 py-2 text-sm focus:outline-none"
                            style={inputStyle}
                        />
                        <button
                            onClick={() => handleAdd('add-type', newType)}
                            className="px-3 py-2 rounded-xl transition-colors"
                            style={{ background: 'var(--accent-primary)', color: 'white' }}
                        >
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}

