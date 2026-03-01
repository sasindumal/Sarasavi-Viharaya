'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { IoAddOutline, IoTrashOutline, IoPricetagsOutline } from 'react-icons/io5';
import { useAuth, canManageContent } from '@/lib/auth';
import { getTags, createTag, deleteTag } from '@/lib/firestore';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import TagChip from '@/components/ui/TagChip';
import Modal from '@/components/ui/Modal';
import type { Tag } from '@/types';

const s: Record<string, React.CSSProperties> = {
    header: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1.5rem',
        flexWrap: 'wrap',
        gap: '1rem',
    },
    title: {
        fontFamily: "'Cinzel', serif",
        fontSize: '1.5rem',
        fontWeight: 700,
        color: '#1A1919',
    },
    card: {
        background: 'rgba(255,255,254,0.75)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(245,185,38,0.12)',
        borderRadius: '20px',
        padding: '2rem',
    },
    tagGrid: {
        display: 'flex',
        flexWrap: 'wrap' as const,
        gap: '0.75rem',
    },
    tagItem: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.5rem 1rem',
        background: 'rgba(252,223,162,0.2)',
        border: '1px solid rgba(245,185,38,0.2)',
        borderRadius: '9999px',
        fontSize: '0.9rem',
        fontWeight: 500,
        color: '#1A1919',
    },
    deleteBtn: {
        width: '22px',
        height: '22px',
        borderRadius: '50%',
        border: 'none',
        background: 'rgba(223,82,42,0.1)',
        color: '#DF522A',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        fontSize: '0.8rem',
    },
    inputRow: {
        display: 'flex',
        gap: '0.75rem',
        marginBottom: '1.5rem',
    },
    empty: {
        textAlign: 'center' as const,
        padding: '2rem',
        opacity: 0.5,
    },
};

export default function AdminTagsPage() {
    const { appUser, loading: authLoading } = useAuth();
    const [tags, setTags] = useState<Tag[]>([]);
    const [loading, setLoading] = useState(true);
    const [newTag, setNewTag] = useState('');
    const [saving, setSaving] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

    useEffect(() => { loadData(); }, []);

    async function loadData() {
        setLoading(true);
        try {
            const t = await getTags();
            setTags(t);
        } catch (err) {
            console.error('Error loading tags:', err);
        }
        setLoading(false);
    }

    async function handleCreate() {
        if (!newTag.trim()) return;
        setSaving(true);
        try {
            await createTag(newTag.trim());
            setNewTag('');
            await loadData();
        } catch (err) {
            console.error('Error creating tag:', err);
        }
        setSaving(false);
    }

    async function handleDelete(id: string) {
        try {
            await deleteTag(id);
            setDeleteConfirm(null);
            await loadData();
        } catch (err) {
            console.error('Error deleting tag:', err);
        }
    }

    if (authLoading || loading) return <LoadingSpinner message="Loading tags..." />;
    if (appUser && !canManageContent(appUser.role)) {
        return <div style={{ textAlign: 'center', padding: '3rem' }}><h3>Access Denied</h3></div>;
    }

    return (
        <div>
            <div style={s.header}>
                <h1 style={s.title}><IoPricetagsOutline style={{ color: '#F5B926' }} /> Manage Tags</h1>
            </div>

            <div style={s.inputRow}>
                <input
                    className="input-field"
                    value={newTag}
                    onChange={e => setNewTag(e.target.value)}
                    placeholder="Enter a new tag name..."
                    onKeyDown={e => e.key === 'Enter' && handleCreate()}
                    style={{ flex: 1 }}
                />
                <button className="btn btn-primary btn-sm" onClick={handleCreate} disabled={saving}>
                    <IoAddOutline /> {saving ? 'Adding...' : 'Add Tag'}
                </button>
            </div>

            <motion.div style={s.card} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                {tags.length === 0 ? (
                    <div style={s.empty}>
                        <IoPricetagsOutline style={{ fontSize: '2rem', marginBottom: '0.5rem', display: 'block', margin: '0 auto 0.5rem' }} />
                        <p>No tags yet. Create one above!</p>
                    </div>
                ) : (
                    <div style={s.tagGrid}>
                        {tags.map(tag => (
                            <div key={tag.id} style={s.tagItem}>
                                <IoPricetagsOutline style={{ color: '#F5B926', fontSize: '0.85rem' }} />
                                {tag.name}
                                <button
                                    style={s.deleteBtn}
                                    onClick={() => setDeleteConfirm(tag.id)}
                                    title="Delete tag"
                                >
                                    <IoTrashOutline />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </motion.div>

            {/* Delete Confirm */}
            <Modal isOpen={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Delete Tag?">
                <p style={{ marginBottom: '1.5rem' }}>This tag will be removed. Events won&apos;t be affected.</p>
                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                    <button className="btn btn-secondary btn-sm" onClick={() => setDeleteConfirm(null)}>Cancel</button>
                    <button className="btn btn-danger btn-sm" onClick={() => deleteConfirm && handleDelete(deleteConfirm)}>Delete</button>
                </div>
            </Modal>
        </div>
    );
}
