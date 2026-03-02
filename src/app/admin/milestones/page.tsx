'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
    IoAddOutline,
    IoCreateOutline,
    IoTrashOutline,
    IoSearchOutline,
    IoFlagOutline,
    IoTimeOutline,
    IoNotificationsOutline,
    IoCloudUploadOutline,
    IoCloseOutline,
    IoImagesOutline,
} from 'react-icons/io5';
import { useAuth, canManageContent } from '@/lib/auth';
import { getMilestones, createMilestone, updateMilestone, deleteMilestone } from '@/lib/firestore';
import { uploadImage, uploadImagesWithProgress } from '@/lib/cloudinary';
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
    formRow3: {
        display: 'grid',
        gridTemplateColumns: '1.5fr 1fr 1fr',
        gap: '1rem',
    },
    uploadArea: {
        border: '2px dashed rgba(245,185,38,0.3)',
        borderRadius: '12px',
        padding: '1.5rem',
        textAlign: 'center' as const,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        background: 'rgba(252,223,162,0.05)',
    },
    coverPreview: {
        position: 'relative' as const,
        borderRadius: '12px',
        overflow: 'hidden',
        maxHeight: '200px',
    },
    coverImg: {
        width: '100%',
        maxHeight: '200px',
        objectFit: 'cover' as const,
        borderRadius: '12px',
    },
    removeBtn: {
        position: 'absolute' as const,
        top: '8px',
        right: '8px',
        width: '28px',
        height: '28px',
        borderRadius: '50%',
        border: 'none',
        background: 'rgba(0,0,0,0.6)',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        fontSize: '1rem',
    },
    photoGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
        gap: '0.5rem',
        marginTop: '0.75rem',
    },
    photoThumb: {
        position: 'relative' as const,
        borderRadius: '8px',
        overflow: 'hidden',
        aspectRatio: '1',
    },
    photoThumbImg: {
        width: '100%',
        height: '100%',
        objectFit: 'cover' as const,
    },
    uploadingOverlay: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        padding: '0.75rem',
        background: 'rgba(245,185,38,0.1)',
        borderRadius: '8px',
        fontSize: '0.85rem',
        color: '#F5B926',
        marginTop: '0.5rem',
    },
};

function isoToLocalDate(iso: string): string {
    if (!iso) return '';
    const d = new Date(iso);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function isoToLocalTime(iso: string): string {
    if (!iso) return '';
    const d = new Date(iso);
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

function localToISO(dateStr: string, timeStr: string): string {
    if (!dateStr) return '';
    const dt = timeStr ? `${dateStr}T${timeStr}` : `${dateStr}T00:00`;
    return new Date(dt).toISOString();
}

function formatTimeDisplay(iso: string): string {
    if (!iso) return '';
    return new Date(iso).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

function computeDuration(startISO: string, endISO: string): string {
    if (!startISO || !endISO) return '';
    const diffMs = new Date(endISO).getTime() - new Date(startISO).getTime();
    if (diffMs <= 0) return '';
    const totalMin = Math.round(diffMs / (1000 * 60));
    if (totalMin < 60) return `${totalMin} minute${totalMin !== 1 ? 's' : ''}`;
    const hrs = Math.floor(totalMin / 60);
    const mins = totalMin % 60;
    if (hrs < 24) {
        if (mins === 0) return `${hrs} hour${hrs !== 1 ? 's' : ''}`;
        return `${hrs}h ${mins}m`;
    }
    const days = Math.floor(hrs / 24);
    const remHrs = hrs % 24;
    if (remHrs === 0) return `${days} day${days !== 1 ? 's' : ''}`;
    return `${days} day${days !== 1 ? 's' : ''} ${remHrs}h`;
}

function EmptyForm(): Omit<Milestone, 'id'> {
    return {
        title: '',
        description: '',
        date: '',
        endDate: '',
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
    const [uploadingCover, setUploadingCover] = useState(false);
    const [uploadProgress, setUploadProgress] = useState<{ current: number; total: number; elapsedMs: number } | null>(null);
    const coverInputRef = useRef<HTMLInputElement>(null);
    const photosInputRef = useRef<HTMLInputElement>(null);

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
            const duration = computeDuration(form.date, form.endDate || '');
            const data = { ...form, duration, updatedAt: new Date().toISOString() };
            if (editingMilestone) {
                await updateMilestone(editingMilestone.id, data);
            } else {
                const created = await createMilestone(data);
                if (form.notifySubscribers && form.isPublished) {
                    try {
                        await fetch('/api/notify', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                title: form.title,
                                description: form.description,
                                date: form.date,
                                type: 'milestone',
                                link: `${window.location.origin}/milestones/${created}`,
                            }),
                        });
                    } catch (notifyErr) {
                        console.error('Failed to send notifications:', notifyErr);
                    }
                }
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

    async function handleCoverUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploadingCover(true);
        try {
            const url = await uploadImage(file, 'sarasavi-viharaya/milestones');
            setForm(prev => ({ ...prev, coverPhoto: url }));
        } catch (err) {
            console.error('Cover upload failed:', err);
        }
        setUploadingCover(false);
        if (coverInputRef.current) coverInputRef.current.value = '';
    }

    async function handlePhotosUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const files = e.target.files;
        if (!files || files.length === 0) return;
        setUploadProgress({ current: 0, total: files.length, elapsedMs: 0 });
        try {
            const urls = await uploadImagesWithProgress(
                Array.from(files),
                'sarasavi-viharaya/milestones',
                (current, total, elapsedMs) => setUploadProgress({ current, total, elapsedMs }),
            );
            setForm(prev => ({ ...prev, photos: [...prev.photos, ...urls] }));
        } catch (err) {
            console.error('Photos upload failed:', err);
        }
        setUploadProgress(null);
        if (photosInputRef.current) photosInputRef.current.value = '';
    }

    function removePhoto(index: number) {
        setForm(prev => ({ ...prev, photos: prev.photos.filter((_, i) => i !== index) }));
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
                <div style={s.formRow3}>
                    <div className="form-group">
                        <label>Date *</label>
                        <input className="input-field" type="date"
                            value={isoToLocalDate(form.date)}
                            onChange={e => {
                                const time = isoToLocalTime(form.date) || '00:00';
                                const newDate = e.target.value;
                                setForm(prev => {
                                    const sameDay = prev.endDate && isoToLocalDate(prev.date) === isoToLocalDate(prev.endDate);
                                    const endDate = prev.endDate
                                        ? sameDay ? localToISO(newDate, isoToLocalTime(prev.endDate)) : prev.endDate
                                        : '';
                                    return { ...prev, date: localToISO(newDate, time), endDate };
                                });
                            }}
                        />
                    </div>
                    <div className="form-group">
                        <label>Start Time *</label>
                        <input className="input-field" type="time"
                            value={isoToLocalTime(form.date)}
                            onChange={e => {
                                const d = isoToLocalDate(form.date);
                                if (d) setForm(prev => ({ ...prev, date: localToISO(d, e.target.value) }));
                            }}
                        />
                    </div>
                    <div className="form-group">
                        <label>End Time</label>
                        <input className="input-field" type="time"
                            value={form.endDate ? isoToLocalTime(form.endDate) : ''}
                            onChange={e => {
                                const d = form.endDate ? isoToLocalDate(form.endDate) : isoToLocalDate(form.date);
                                if (d) setForm(prev => ({ ...prev, endDate: localToISO(d, e.target.value) }));
                            }}
                        />
                    </div>
                </div>

                {form.date && (
                    <div style={{ marginTop: '-0.5rem', marginBottom: '0.75rem' }}>
                        <label style={{ fontSize: '0.85rem', color: '#666', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                            <input type="checkbox"
                                checked={!!(form.date && form.endDate && isoToLocalDate(form.date) !== isoToLocalDate(form.endDate))}
                                onChange={e => {
                                    if (e.target.checked) {
                                        const nextDay = new Date(form.date);
                                        nextDay.setDate(nextDay.getDate() + 1);
                                        const endTime = form.endDate ? isoToLocalTime(form.endDate) : isoToLocalTime(form.date);
                                        setForm(prev => ({ ...prev, endDate: localToISO(isoToLocalDate(nextDay.toISOString()), endTime || '00:00') }));
                                    } else {
                                        const endTime = form.endDate ? isoToLocalTime(form.endDate) : '';
                                        setForm(prev => ({ ...prev, endDate: endTime ? localToISO(isoToLocalDate(form.date), endTime) : '' }));
                                    }
                                }}
                            />
                            Spans multiple days
                        </label>
                    </div>
                )}

                {form.date && form.endDate && isoToLocalDate(form.date) !== isoToLocalDate(form.endDate) && (
                    <div className="form-group" style={{ marginTop: '-0.5rem' }}>
                        <label>End Date</label>
                        <input className="input-field" type="date"
                            value={isoToLocalDate(form.endDate || '')}
                            onChange={e => {
                                const time = isoToLocalTime(form.endDate || '') || '23:59';
                                setForm(prev => ({ ...prev, endDate: localToISO(e.target.value, time) }));
                            }}
                        />
                    </div>
                )}

                {form.date && form.endDate && (() => {
                    const dur = computeDuration(form.date, form.endDate);
                    return dur ? (
                        <div style={{ fontSize: '0.85rem', color: '#888', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <IoTimeOutline style={{ fontSize: '1rem' }} />
                            {formatTimeDisplay(form.date)} → {formatTimeDisplay(form.endDate)} &bull; {dur}
                        </div>
                    ) : (
                        <div style={{ fontSize: '0.85rem', color: '#e74c3c', marginBottom: '0.75rem' }}>
                            End must be after start
                        </div>
                    );
                })()}

                {/* Cover Photo Upload */}
                <div className="form-group">
                    <label>Cover Photo</label>
                    <input type="file" accept="image/*" ref={coverInputRef} onChange={handleCoverUpload} style={{ display: 'none' }} />
                    {form.coverPhoto ? (
                        <div style={s.coverPreview}>
                            <img src={form.coverPhoto} alt="Cover" style={s.coverImg} />
                            <button style={s.removeBtn} onClick={() => setForm(prev => ({ ...prev, coverPhoto: '' }))} title="Remove cover"><IoCloseOutline /></button>
                        </div>
                    ) : (
                        <div style={s.uploadArea} onClick={() => coverInputRef.current?.click()}>
                            <IoCloudUploadOutline style={{ fontSize: '2rem', color: '#F5B926', marginBottom: '0.5rem' }} />
                            <p style={{ fontSize: '0.9rem', color: '#666', margin: 0 }}>Click to upload cover photo</p>
                            <p style={{ fontSize: '0.75rem', color: '#999', margin: '0.25rem 0 0' }}>JPG, PNG, WebP</p>
                        </div>
                    )}
                    {uploadingCover && (
                        <div style={s.uploadingOverlay}>
                            <LoadingSpinner size="sm" message="" /> Uploading cover...
                        </div>
                    )}
                </div>

                {/* Photo Album Upload */}
                <div className="form-group">
                    <label>Photo Album</label>
                    <input type="file" accept="image/*" multiple ref={photosInputRef} onChange={handlePhotosUpload} style={{ display: 'none' }} />
                    <div style={s.uploadArea} onClick={() => photosInputRef.current?.click()}>
                        <IoImagesOutline style={{ fontSize: '1.5rem', color: '#F5B926', marginBottom: '0.25rem' }} />
                        <p style={{ fontSize: '0.9rem', color: '#666', margin: 0 }}>Click to upload photos (select multiple)</p>
                    </div>
                    {uploadProgress && (() => {
                        const { current, total, elapsedMs } = uploadProgress;
                        const done = current < total ? current : total;
                        let eta = '';
                        if (done > 0 && done < total) {
                            const avgMs = elapsedMs / done;
                            const remainMs = avgMs * (total - done);
                            const remainSec = Math.ceil(remainMs / 1000);
                            eta = remainSec >= 60
                                ? `~${Math.ceil(remainSec / 60)} min remaining`
                                : `~${remainSec}s remaining`;
                        }
                        return (
                            <div style={s.uploadingOverlay}>
                                <LoadingSpinner size="sm" message="" />
                                <span>Uploading {done < total ? `${done + 1}` : total} of {total} photo{total !== 1 ? 's' : ''}...</span>
                                {eta && <span style={{ fontSize: '0.8rem', color: '#999' }}>{eta}</span>}
                                <div style={{ width: '100%', height: '4px', background: 'rgba(245,185,38,0.15)', borderRadius: '2px', marginTop: '0.25rem', overflow: 'hidden' }}>
                                    <div style={{ width: `${Math.round((done / total) * 100)}%`, height: '100%', background: '#F5B926', borderRadius: '2px', transition: 'width 0.3s ease' }} />
                                </div>
                            </div>
                        );
                    })()}
                    {form.photos.length > 0 && (
                        <div style={s.photoGrid}>
                            {form.photos.map((photo, i) => (
                                <div key={i} style={s.photoThumb}>
                                    <img src={photo} alt={`Photo ${i + 1}`} style={s.photoThumbImg} />
                                    <button style={{ ...s.removeBtn, top: '4px', right: '4px', width: '22px', height: '22px', fontSize: '0.8rem' }} onClick={() => removePhoto(i)} title="Remove"><IoCloseOutline /></button>
                                </div>
                            ))}
                        </div>
                    )}
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
                    <button className="btn btn-primary btn-sm" onClick={handleSave} disabled={saving || uploadingCover || !!uploadProgress}>
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
