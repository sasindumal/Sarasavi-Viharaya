'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    IoAddOutline,
    IoCreateOutline,
    IoTrashOutline,
    IoSearchOutline,
    IoCalendarOutline,
    IoNotificationsOutline,
} from 'react-icons/io5';
import { useAuth, canManageContent } from '@/lib/auth';
import { getEvents, createEvent, updateEvent, deleteEvent, getTags } from '@/lib/firestore';
import Modal from '@/components/ui/Modal';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import TagChip from '@/components/ui/TagChip';
import type { Event, Tag } from '@/types';

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
    searchRow: {
        display: 'flex',
        gap: '0.75rem',
        marginBottom: '1.5rem',
        flexWrap: 'wrap' as const,
    },
    searchInput: {
        flex: 1,
        minWidth: '200px',
        padding: '0.65rem 1rem 0.65rem 2.5rem',
        border: '1.5px solid rgba(52,53,52,0.12)',
        borderRadius: '12px',
        fontSize: '0.9rem',
        background: 'rgba(255,255,254,0.8)',
        outline: 'none',
    },
    searchWrap: {
        position: 'relative' as const,
        flex: 1,
        minWidth: '200px',
    },
    searchIcon: {
        position: 'absolute' as const,
        left: '0.75rem',
        top: '50%',
        transform: 'translateY(-50%)',
        color: '#343534',
        opacity: 0.4,
    },
    card: {
        background: 'rgba(255,255,254,0.75)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(245,185,38,0.12)',
        borderRadius: '16px',
        overflow: 'hidden',
    },
    actions: {
        display: 'flex',
        gap: '0.5rem',
    },
    iconBtn: {
        width: '34px',
        height: '34px',
        borderRadius: '8px',
        border: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        fontSize: '1rem',
        transition: 'all 0.2s ease',
    },
    formRow: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '1rem',
    },
    tagList: {
        display: 'flex',
        flexWrap: 'wrap' as const,
        gap: '0.5rem',
        marginTop: '0.5rem',
    },
};

function EmptyForm(): Omit<Event, 'id'> {
    return {
        title: '',
        description: '',
        date: '',
        duration: '',
        tags: [],
        coverPhoto: '',
        photos: [],
        notifySubscribers: false,
        isPublished: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: '',
    };
}

export default function AdminEventsPage() {
    const { appUser, loading: authLoading } = useAuth();
    const [events, setEvents] = useState<Event[]>([]);
    const [tags, setTags] = useState<Tag[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState<Event | null>(null);
    const [form, setForm] = useState<Omit<Event, 'id'>>(EmptyForm());
    const [saving, setSaving] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        setLoading(true);
        try {
            const [evts, tgs] = await Promise.all([getEvents(), getTags()]);
            setEvents(evts);
            setTags(tgs);
        } catch (err) {
            console.error('Error loading data:', err);
        }
        setLoading(false);
    }

    function openCreate() {
        setEditingEvent(null);
        setForm({ ...EmptyForm(), createdBy: appUser?.uid || '' });
        setModalOpen(true);
    }

    function openEdit(evt: Event) {
        setEditingEvent(evt);
        const { id, ...rest } = evt;
        setForm(rest);
        setModalOpen(true);
    }

    async function handleSave() {
        if (!form.title || !form.date) return;
        setSaving(true);
        try {
            const data = { ...form, updatedAt: new Date().toISOString() };
            if (editingEvent) {
                await updateEvent(editingEvent.id, data);
            } else {
                await createEvent(data);
            }
            setModalOpen(false);
            await loadData();
        } catch (err) {
            console.error('Error saving event:', err);
        }
        setSaving(false);
    }

    async function handleDelete(id: string) {
        try {
            await deleteEvent(id);
            setDeleteConfirm(null);
            await loadData();
        } catch (err) {
            console.error('Error deleting event:', err);
        }
    }

    function toggleTag(tagName: string) {
        setForm(prev => ({
            ...prev,
            tags: prev.tags.includes(tagName)
                ? prev.tags.filter(t => t !== tagName)
                : [...prev.tags, tagName],
        }));
    }

    const filtered = events.filter(e =>
        e.title.toLowerCase().includes(search.toLowerCase())
    );

    if (authLoading || loading) return <LoadingSpinner message="Loading events..." />;
    if (appUser && !canManageContent(appUser.role)) {
        return <div style={{ textAlign: 'center', padding: '3rem' }}><h3>Access Denied</h3><p>You don&apos;t have permission to manage events.</p></div>;
    }

    return (
        <div>
            <div style={s.header}>
                <h1 style={s.title}><IoCalendarOutline style={{ color: '#F5B926' }} /> Manage Events</h1>
                <button className="btn btn-primary btn-sm" onClick={openCreate}><IoAddOutline /> New Event</button>
            </div>

            <div style={s.searchRow}>
                <div style={s.searchWrap}>
                    <IoSearchOutline style={s.searchIcon} />
                    <input
                        type="text"
                        style={s.searchInput}
                        placeholder="Search events..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <motion.div style={s.card} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Date</th>
                                <th>Tags</th>
                                <th>Published</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr><td colSpan={5} style={{ textAlign: 'center', padding: '2rem', opacity: 0.5 }}>No events found</td></tr>
                            ) : (
                                filtered.map(evt => (
                                    <tr key={evt.id}>
                                        <td style={{ fontWeight: 600 }}>{evt.title}</td>
                                        <td>{new Date(evt.date).toLocaleDateString()}</td>
                                        <td>
                                            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                                                {evt.tags.slice(0, 3).map(t => <TagChip key={t} label={t} />)}
                                            </div>
                                        </td>
                                        <td>
                                            <span className={evt.isPublished ? 'badge badge-gold' : 'badge badge-red'}>
                                                {evt.isPublished ? 'Published' : 'Draft'}
                                            </span>
                                        </td>
                                        <td>
                                            <div style={s.actions}>
                                                <button
                                                    style={{ ...s.iconBtn, background: 'rgba(245,185,38,0.1)', color: '#F5B926' }}
                                                    onClick={() => openEdit(evt)}
                                                    title="Edit"
                                                >
                                                    <IoCreateOutline />
                                                </button>
                                                <button
                                                    style={{ ...s.iconBtn, background: 'rgba(223,82,42,0.1)', color: '#DF522A' }}
                                                    onClick={() => setDeleteConfirm(evt.id)}
                                                    title="Delete"
                                                >
                                                    <IoTrashOutline />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </motion.div>

            {/* Create/Edit Modal */}
            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingEvent ? 'Edit Event' : 'Create Event'} maxWidth="650px">
                <div className="form-group">
                    <label>Title *</label>
                    <input className="input-field" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Event title" />
                </div>
                <div className="form-group">
                    <label>Description</label>
                    <textarea className="input-field" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Event description" />
                </div>
                <div style={s.formRow}>
                    <div className="form-group">
                        <label>Date & Time *</label>
                        <input className="input-field" type="datetime-local" value={form.date ? form.date.slice(0, 16) : ''} onChange={e => setForm({ ...form, date: new Date(e.target.value).toISOString() })} />
                    </div>
                    <div className="form-group">
                        <label>Duration</label>
                        <input className="input-field" value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} placeholder="e.g., 2 days" />
                    </div>
                </div>
                <div className="form-group">
                    <label>Tags</label>
                    <div style={s.tagList}>
                        {tags.map(tag => (
                            <TagChip key={tag.id} label={tag.name} active={form.tags.includes(tag.name)} onClick={() => toggleTag(tag.name)} />
                        ))}
                    </div>
                </div>
                <div className="form-group">
                    <label>Cover Photo URL</label>
                    <input className="input-field" value={form.coverPhoto || ''} onChange={e => setForm({ ...form, coverPhoto: e.target.value })} placeholder="https://..." />
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', margin: '1rem 0' }}>
                    <label className="toggle">
                        <input type="checkbox" checked={form.isPublished} onChange={e => setForm({ ...form, isPublished: e.target.checked })} />
                        <span className="toggle-slider" />
                    </label>
                    <span style={{ fontSize: '0.9rem' }}>Published</span>

                    <label className="toggle" style={{ marginLeft: '1.5rem' }}>
                        <input type="checkbox" checked={form.notifySubscribers} onChange={e => setForm({ ...form, notifySubscribers: e.target.checked })} />
                        <span className="toggle-slider" />
                    </label>
                    <span style={{ fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '4px' }}><IoNotificationsOutline /> Notify</span>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                    <button className="btn btn-secondary btn-sm" onClick={() => setModalOpen(false)}>Cancel</button>
                    <button className="btn btn-primary btn-sm" onClick={handleSave} disabled={saving}>
                        {saving ? 'Saving...' : editingEvent ? 'Update Event' : 'Create Event'}
                    </button>
                </div>
            </Modal>

            {/* Delete Confirm Modal */}
            <Modal isOpen={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Confirm Delete">
                <p style={{ marginBottom: '1.5rem' }}>Are you sure you want to delete this event? This action cannot be undone.</p>
                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                    <button className="btn btn-secondary btn-sm" onClick={() => setDeleteConfirm(null)}>Cancel</button>
                    <button className="btn btn-danger btn-sm" onClick={() => deleteConfirm && handleDelete(deleteConfirm)}>Delete</button>
                </div>
            </Modal>
        </div>
    );
}
