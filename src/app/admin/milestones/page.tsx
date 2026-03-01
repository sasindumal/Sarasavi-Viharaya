'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    IoAddOutline,
    IoCreateOutline,
    IoTrashOutline,
    IoSearchOutline,
    IoFlagOutline,
} from 'react-icons/io5';
import { useAuth, canManageContent } from '@/lib/auth';
import { getMilestones, createMilestone, updateMilestone, deleteMilestone } from '@/lib/firestore';
import Modal from '@/components/ui/Modal';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import type { Milestone } from '@/types';

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
    searchWrap: {
        position: 'relative' as const,
        flex: 1,
        minWidth: '200px',
        marginBottom: '1.5rem',
    },
    searchIcon: {
        position: 'absolute' as const,
        left: '0.75rem',
        top: '50%',
        transform: 'translateY(-50%)',
        color: '#343534',
        opacity: 0.4,
    },
    searchInput: {
        width: '100%',
        padding: '0.65rem 1rem 0.65rem 2.5rem',
        border: '1.5px solid rgba(52,53,52,0.12)',
        borderRadius: '12px',
        fontSize: '0.9rem',
        background: 'rgba(255,255,254,0.8)',
        outline: 'none',
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
};

function EmptyForm(): Omit<Milestone, 'id'> {
    return {
        title: '',
        description: '',
        date: '',
        duration: '',
        coverPhoto: '',
        photos: [],
        notifySubscribers: false,
        isPublished: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: '',
    };
}

export default function AdminMilestonesPage() {
    const { appUser, loading: authLoading } = useAuth();
    const [milestones, setMilestones] = useState<Milestone[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [editingMilestone, setEditingMilestone] = useState<Milestone | null>(null);
    const [form, setForm] = useState<Omit<Milestone, 'id'>>(EmptyForm());
    const [saving, setSaving] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

    useEffect(() => { loadData(); }, []);

    async function loadData() {
        setLoading(true);
        try {
            const ms = await getMilestones();
            setMilestones(ms);
        } catch (err) {
            console.error('Error loading milestones:', err);
        }
        setLoading(false);
    }

    function openCreate() {
        setEditingMilestone(null);
        setForm({ ...EmptyForm(), createdBy: appUser?.uid || '' });
        setModalOpen(true);
    }

    function openEdit(ms: Milestone) {
        setEditingMilestone(ms);
        const { id, ...rest } = ms;
        setForm(rest);
        setModalOpen(true);
    }

    async function handleSave() {
        if (!form.title || !form.date) return;
        setSaving(true);
        try {
            const data = { ...form, updatedAt: new Date().toISOString() };
            if (editingMilestone) {
                await updateMilestone(editingMilestone.id, data);
            } else {
                await createMilestone(data);
            }
            setModalOpen(false);
            await loadData();
        } catch (err) {
            console.error('Error saving milestone:', err);
        }
        setSaving(false);
    }

    async function handleDelete(id: string) {
        try {
            await deleteMilestone(id);
            setDeleteConfirm(null);
            await loadData();
        } catch (err) {
            console.error('Error deleting milestone:', err);
        }
    }

    const filtered = milestones.filter(m =>
        m.title.toLowerCase().includes(search.toLowerCase())
    );

    if (authLoading || loading) return <LoadingSpinner message="Loading milestones..." />;
    if (appUser && !canManageContent(appUser.role)) {
        return <div style={{ textAlign: 'center', padding: '3rem' }}><h3>Access Denied</h3></div>;
    }

    return (
        <div>
            <div style={s.header}>
                <h1 style={s.title}><IoFlagOutline style={{ color: '#F5B926' }} /> Manage Milestones</h1>
                <button className="btn btn-primary btn-sm" onClick={openCreate}><IoAddOutline /> New Milestone</button>
            </div>

            <div style={s.searchWrap}>
                <IoSearchOutline style={s.searchIcon} />
                <input
                    type="text"
                    style={s.searchInput}
                    placeholder="Search milestones..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
            </div>

            <motion.div style={s.card} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Date</th>
                                <th>Duration</th>
                                <th>Published</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr><td colSpan={5} style={{ textAlign: 'center', padding: '2rem', opacity: 0.5 }}>No milestones found</td></tr>
                            ) : (
                                filtered.map(ms => (
                                    <tr key={ms.id}>
                                        <td style={{ fontWeight: 600 }}>{ms.title}</td>
                                        <td>{new Date(ms.date).toLocaleDateString()}</td>
                                        <td>{ms.duration}</td>
                                        <td>
                                            <span className={ms.isPublished ? 'badge badge-gold' : 'badge badge-red'}>
                                                {ms.isPublished ? 'Published' : 'Draft'}
                                            </span>
                                        </td>
                                        <td>
                                            <div style={s.actions}>
                                                <button
                                                    style={{ ...s.iconBtn, background: 'rgba(245,185,38,0.1)', color: '#F5B926' }}
                                                    onClick={() => openEdit(ms)}
                                                    title="Edit"
                                                ><IoCreateOutline /></button>
                                                <button
                                                    style={{ ...s.iconBtn, background: 'rgba(223,82,42,0.1)', color: '#DF522A' }}
                                                    onClick={() => setDeleteConfirm(ms.id)}
                                                    title="Delete"
                                                ><IoTrashOutline /></button>
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
            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingMilestone ? 'Edit Milestone' : 'Create Milestone'} maxWidth="600px">
                <div className="form-group">
                    <label>Title *</label>
                    <input className="input-field" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Milestone title" />
                </div>
                <div className="form-group">
                    <label>Description</label>
                    <textarea className="input-field" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Milestone description" />
                </div>
                <div style={s.formRow}>
                    <div className="form-group">
                        <label>Date *</label>
                        <input className="input-field" type="datetime-local" value={form.date ? form.date.slice(0, 16) : ''} onChange={e => setForm({ ...form, date: new Date(e.target.value).toISOString() })} />
                    </div>
                    <div className="form-group">
                        <label>Duration</label>
                        <input className="input-field" value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} placeholder="e.g., 1 day" />
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
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                    <button className="btn btn-secondary btn-sm" onClick={() => setModalOpen(false)}>Cancel</button>
                    <button className="btn btn-primary btn-sm" onClick={handleSave} disabled={saving}>
                        {saving ? 'Saving...' : editingMilestone ? 'Update' : 'Create'}
                    </button>
                </div>
            </Modal>

            {/* Delete Confirm */}
            <Modal isOpen={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Confirm Delete">
                <p style={{ marginBottom: '1.5rem' }}>Are you sure you want to delete this milestone? This action cannot be undone.</p>
                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                    <button className="btn btn-secondary btn-sm" onClick={() => setDeleteConfirm(null)}>Cancel</button>
                    <button className="btn btn-danger btn-sm" onClick={() => deleteConfirm && handleDelete(deleteConfirm)}>Delete</button>
                </div>
            </Modal>
        </div>
    );
}
