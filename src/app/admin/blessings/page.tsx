'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    IoAddOutline,
    IoCreateOutline,
    IoTrashOutline,
    IoSearchOutline,
    IoPersonOutline,
    IoCloudUploadOutline,
    IoCloseOutline,
    IoArrowUpOutline,
    IoArrowDownOutline,
} from 'react-icons/io5';
import { useAuth, canManageContent } from '@/lib/auth';
import { getBlessings, createBlessing, updateBlessing, deleteBlessing } from '@/lib/firestore';
import { uploadImage } from '@/lib/cloudinary';
import Modal from '@/components/ui/Modal';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import type { BlessingMessage } from '@/types';

const s: Record<string, React.CSSProperties> = {
    header: {
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem',
    },
    title: { fontFamily: "'Cinzel', serif", fontSize: '1.5rem', fontWeight: 700, color: '#1A1919' },
    searchRow: { display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' as const },
    searchWrap: { position: 'relative' as const, flex: 1, minWidth: '200px' },
    searchInput: {
        width: '100%', padding: '0.65rem 1rem 0.65rem 2.5rem',
        border: '1.5px solid rgba(52,53,52,0.12)', borderRadius: '12px',
        fontSize: '0.9rem', background: 'rgba(255,255,254,0.8)', outline: 'none',
    },
    searchIcon: { position: 'absolute' as const, left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#343534', opacity: 0.4 },
    card: {
        background: 'rgba(255,255,254,0.75)', backdropFilter: 'blur(16px)',
        border: '1px solid rgba(245,185,38,0.12)', borderRadius: '16px', overflow: 'hidden',
    },
    row: {
        display: 'flex', alignItems: 'center', gap: '1rem',
        padding: '1rem 1.25rem', borderBottom: '1px solid rgba(52,53,52,0.06)',
    },
    avatar: {
        width: '48px', height: '48px', borderRadius: '50%', overflow: 'hidden',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(245,185,38,0.1)', color: '#F5B926', fontSize: '1.2rem', flexShrink: 0,
    },
    info: { flex: 1, minWidth: 0 },
    name: { fontSize: '0.9rem', fontWeight: 600, color: '#1A1919' },
    titleText: { fontSize: '0.8rem', color: 'rgba(52,53,52,0.6)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const },
    actions: { display: 'flex', gap: '0.35rem', flexShrink: 0 },
    iconBtn: {
        width: '34px', height: '34px', borderRadius: '8px', border: 'none',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', fontSize: '1rem', transition: 'all 0.2s ease',
    },
    empty: { textAlign: 'center' as const, padding: '4rem 2rem', color: 'rgba(52,53,52,0.5)' },
    formGroup: { marginBottom: '1rem' },
    label: { display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#343534', marginBottom: '0.35rem' },
    input: {
        width: '100%', padding: '0.6rem 0.85rem', border: '1.5px solid rgba(52,53,52,0.12)',
        borderRadius: '10px', fontSize: '0.9rem', background: 'rgba(255,255,254,0.8)', outline: 'none',
    },
    textarea: {
        width: '100%', padding: '0.6rem 0.85rem', border: '1.5px solid rgba(52,53,52,0.12)',
        borderRadius: '10px', fontSize: '0.9rem', background: 'rgba(255,255,254,0.8)',
        outline: 'none', resize: 'vertical' as const, minHeight: '100px',
    },
    photoPreview: {
        width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover' as const,
        border: '2px solid rgba(245,185,38,0.2)',
    },
    uploadBtn: {
        display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
        padding: '0.45rem 1rem', borderRadius: '10px',
        border: '1.5px dashed rgba(245,185,38,0.4)', background: 'rgba(252,223,162,0.05)',
        cursor: 'pointer', fontSize: '0.82rem', color: '#343534',
    },
};

// Existing hardcoded data to seed from
const SEED_BLESSINGS: Omit<BlessingMessage, 'id'>[] = [
    { personName: 'Most Ven. Kiribathgoda Gananananda Thero', personTitle: 'Chief Sangha Nayaka, Mahamevnawa Buddhist Monastery', message: 'May the Sarasavi Viharaya at the University of Jaffna continue to be a beacon of wisdom and compassion. The dedication of the students who built this sacred place with their own hands is a testament to the living Dhamma. May this temple bring peace and enlightenment to all who seek refuge within its grounds.', order: 1 },
    { personName: 'Prof. A. Atputharajah', personTitle: 'Founding Dean, Faculty of Engineering, University of Jaffna', message: 'Sarasavi Viharaya represents the unity and determination of students across all communities. From the initial concept to the magnificent temple complex we see today, this journey has been one of overcoming obstacles through collective effort. I am deeply moved by the interfaith harmony this project has fostered.', order: 2 },
    { personName: 'Eng. Saliya Sampath', personTitle: 'Senior Lecturer, Faculty of Engineering & Senior Treasurer, Buddhist Brotherhood Society', message: 'Building Sarasavi Viharaya has been one of the most fulfilling experiences of my life. Watching students from different batches come together, working overnight, carrying cement and bricks — it showed me the true power of faith and devotion. This temple is not just a building; it is a living monument to student dedication.', order: 3 },
    { personName: 'Prof. Lilantha Samaranayake', personTitle: 'University of Peradeniya', message: 'The Sarasavi Viharaya stands as a remarkable achievement in the northern region of Sri Lanka. The compassion and hard work of the students, combined with the guidance of the Buddhist monks, have created a space where anyone can find spiritual solace. My involvement with this project has been a source of great merit.', order: 4 },
    { personName: 'Ven. Nalande Pawara Thero', personTitle: 'Chief Patron, Sarasavi Viharaya', message: 'The construction of the Sri Maha Bodhi Prakaraya and the relic palace at Sarasavi Viharaya has been a sacred duty. May the Triple Gem — the Buddha, the Dhamma, and the Sangha — continue to bless this temple and all who contribute to its growth. Saadhu! Saadhu! Saadhu!', order: 5 },
    { personName: 'Mr. Ajantha Premarathna', personTitle: 'Quantity Surveyor & Key Donor', message: 'Supporting the construction of the stupa at Sarasavi Viharaya has been one of the most meritorious deeds I have undertaken. The students\' commitment inspired me to continue fundraising efforts even during the most challenging economic times. This temple will serve generations of students to come.', order: 6 },
];

export default function AdminBlessingsPage() {
    const { appUser, loading: authLoading } = useAuth();
    const [blessings, setBlessings] = useState<BlessingMessage[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [editItem, setEditItem] = useState<BlessingMessage | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<BlessingMessage | null>(null);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [seeding, setSeeding] = useState(false);

    const [form, setForm] = useState({ personName: '', personTitle: '', message: '', personPhoto: '', order: 0 });

    const allowed = appUser && canManageContent(appUser.role);

    const load = async () => {
        setLoading(true);
        try { setBlessings(await getBlessings()); } catch (e) { console.error(e); }
        setLoading(false);
    };

    useEffect(() => { load(); }, []);

    const filtered = blessings.filter(b => {
        if (!search) return true;
        const q = search.toLowerCase();
        return b.personName.toLowerCase().includes(q) || b.personTitle.toLowerCase().includes(q);
    });

    const openNew = () => {
        setEditItem(null);
        setForm({ personName: '', personTitle: '', message: '', personPhoto: '', order: blessings.length + 1 });
        setModalOpen(true);
    };

    const openEdit = (b: BlessingMessage) => {
        setEditItem(b);
        setForm({ personName: b.personName, personTitle: b.personTitle, message: b.message, personPhoto: b.personPhoto || '', order: b.order });
        setModalOpen(true);
    };

    const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        try {
            const url = await uploadImage(file);
            setForm(f => ({ ...f, personPhoto: url }));
        } catch (err) { console.error(err); }
        setUploading(false);
    };

    const handleSave = async () => {
        if (!form.personName || !form.message) return;
        setSaving(true);
        try {
            const data = {
                personName: form.personName,
                personTitle: form.personTitle,
                message: form.message,
                personPhoto: form.personPhoto || undefined,
                order: form.order,
            };
            if (editItem) {
                await updateBlessing(editItem.id, data);
            } else {
                await createBlessing(data as Omit<BlessingMessage, 'id'>);
            }
            setModalOpen(false);
            await load();
        } catch (err) { console.error(err); }
        setSaving(false);
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        try {
            await deleteBlessing(deleteTarget.id);
            setDeleteTarget(null);
            await load();
        } catch (err) { console.error(err); }
    };

    const handleReorder = async (id: string, direction: 'up' | 'down') => {
        const idx = blessings.findIndex(b => b.id === id);
        if (idx < 0) return;
        const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
        if (swapIdx < 0 || swapIdx >= blessings.length) return;
        try {
            await updateBlessing(blessings[idx].id, { order: blessings[swapIdx].order });
            await updateBlessing(blessings[swapIdx].id, { order: blessings[idx].order });
            await load();
        } catch (err) { console.error(err); }
    };

    const handleSeedExisting = async () => {
        if (blessings.length > 0) return;
        setSeeding(true);
        try {
            for (const b of SEED_BLESSINGS) {
                await createBlessing(b);
            }
            await load();
        } catch (err) { console.error(err); }
        setSeeding(false);
    };

    if (authLoading || loading) return <LoadingSpinner message="Loading blessings..." />;
    if (!allowed) return <p style={{ padding: '2rem' }}>You don&apos;t have permission to view this page.</p>;

    return (
        <div>
            <div style={s.header}>
                <h1 style={s.title}>Blessings</h1>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {blessings.length === 0 && (
                        <button
                            onClick={handleSeedExisting}
                            disabled={seeding}
                            style={{
                                padding: '0.55rem 1.25rem', borderRadius: '12px',
                                border: '1.5px solid rgba(52,53,52,0.15)', background: 'rgba(255,255,254,0.8)',
                                cursor: 'pointer', fontSize: '0.85rem', fontWeight: 500,
                            }}
                        >
                            {seeding ? 'Adding...' : 'Add Existing Data'}
                        </button>
                    )}
                    <button
                        onClick={openNew}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '0.4rem',
                            padding: '0.55rem 1.25rem', borderRadius: '12px', border: 'none',
                            background: 'linear-gradient(135deg, #F5B926, #ED9F2D)',
                            color: '#1A1919', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer',
                        }}
                    >
                        <IoAddOutline /> Add Blessing
                    </button>
                </div>
            </div>

            <div style={s.searchRow}>
                <div style={s.searchWrap}>
                    <IoSearchOutline style={s.searchIcon} />
                    <input style={s.searchInput} placeholder="Search blessings..." value={search} onChange={e => setSearch(e.target.value)} />
                </div>
            </div>

            <motion.div style={s.card} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
                {filtered.length === 0 ? (
                    <div style={s.empty}>
                        <IoPersonOutline style={{ fontSize: '2.5rem', opacity: 0.3, marginBottom: '0.75rem' }} />
                        <p style={{ margin: 0, fontWeight: 500 }}>{search ? 'No matches' : 'No blessings yet'}</p>
                    </div>
                ) : (
                    <AnimatePresence>
                        {filtered.map((b, idx) => (
                            <motion.div key={b.id} style={s.row} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, height: 0 }}>
                                <div style={s.avatar}>
                                    {b.personPhoto ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img src={b.personPhoto} alt={b.personName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <IoPersonOutline />
                                    )}
                                </div>
                                <div style={s.info}>
                                    <div style={s.name}>{b.personName}</div>
                                    <div style={s.titleText}>{b.personTitle}</div>
                                </div>
                                <span style={{ fontSize: '0.75rem', color: 'rgba(52,53,52,0.4)', flexShrink: 0 }}>#{b.order}</span>
                                <div style={s.actions}>
                                    <button style={{ ...s.iconBtn, background: 'rgba(52,53,52,0.06)', color: '#343534' }} onClick={() => handleReorder(b.id, 'up')} disabled={idx === 0} title="Move up"><IoArrowUpOutline /></button>
                                    <button style={{ ...s.iconBtn, background: 'rgba(52,53,52,0.06)', color: '#343534' }} onClick={() => handleReorder(b.id, 'down')} disabled={idx === filtered.length - 1} title="Move down"><IoArrowDownOutline /></button>
                                    <button style={{ ...s.iconBtn, background: 'rgba(245,185,38,0.1)', color: '#d9a01e' }} onClick={() => openEdit(b)} title="Edit"><IoCreateOutline /></button>
                                    <button style={{ ...s.iconBtn, background: 'rgba(223,82,42,0.08)', color: '#DF522A' }} onClick={() => setDeleteTarget(b)} title="Delete"><IoTrashOutline /></button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                )}
            </motion.div>

            {/* Create / Edit Modal */}
            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editItem ? 'Edit Blessing' : 'Add Blessing'}>
                <div style={s.formGroup}>
                    <label style={s.label}>Person Name *</label>
                    <input style={s.input} value={form.personName} onChange={e => setForm({ ...form, personName: e.target.value })} placeholder="e.g. Ven. Nalande Pawara Thero" />
                </div>
                <div style={s.formGroup}>
                    <label style={s.label}>Title / Designation</label>
                    <input style={s.input} value={form.personTitle} onChange={e => setForm({ ...form, personTitle: e.target.value })} placeholder="e.g. Chief Patron, Sarasavi Viharaya" />
                </div>
                <div style={s.formGroup}>
                    <label style={s.label}>Message *</label>
                    <textarea style={s.textarea} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} placeholder="Blessing message..." />
                </div>
                <div style={s.formGroup}>
                    <label style={s.label}>Photo</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        {form.personPhoto && (
                            <div style={{ position: 'relative' }}>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={form.personPhoto} alt="Preview" style={s.photoPreview} />
                                <button onClick={() => setForm({ ...form, personPhoto: '' })} style={{ position: 'absolute', top: -6, right: -6, width: 20, height: 20, borderRadius: '50%', border: 'none', background: '#DF522A', color: '#fff', fontSize: '0.7rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><IoCloseOutline /></button>
                            </div>
                        )}
                        <label style={s.uploadBtn}>
                            <IoCloudUploadOutline /> {uploading ? 'Uploading...' : 'Upload Photo'}
                            <input type="file" accept="image/*" hidden onChange={handlePhotoUpload} disabled={uploading} />
                        </label>
                    </div>
                </div>
                <div style={s.formGroup}>
                    <label style={s.label}>Display Order</label>
                    <input style={{ ...s.input, width: '100px' }} type="number" min={1} value={form.order} onChange={e => setForm({ ...form, order: parseInt(e.target.value) || 1 })} />
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
                    <button onClick={() => setModalOpen(false)} style={{ padding: '0.5rem 1.25rem', borderRadius: '10px', border: '1.5px solid rgba(52,53,52,0.12)', background: 'transparent', cursor: 'pointer' }}>Cancel</button>
                    <button onClick={handleSave} disabled={saving || !form.personName || !form.message} style={{ padding: '0.5rem 1.25rem', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg, #F5B926, #ED9F2D)', color: '#1A1919', fontWeight: 600, cursor: 'pointer', opacity: saving ? 0.6 : 1 }}>
                        {saving ? 'Saving...' : editItem ? 'Update' : 'Create'}
                    </button>
                </div>
            </Modal>

            {/* Delete Modal */}
            <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete Blessing">
                <p style={{ margin: '0 0 1.5rem', fontSize: '0.9rem', color: '#343534' }}>
                    Remove blessing from <strong>{deleteTarget?.personName}</strong>?
                </p>
                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                    <button onClick={() => setDeleteTarget(null)} style={{ padding: '0.5rem 1.25rem', borderRadius: '10px', border: '1.5px solid rgba(52,53,52,0.12)', background: 'transparent', cursor: 'pointer' }}>Cancel</button>
                    <button onClick={handleDelete} style={{ padding: '0.5rem 1.25rem', borderRadius: '10px', border: 'none', background: '#DF522A', color: '#fff', fontWeight: 600, cursor: 'pointer' }}>Delete</button>
                </div>
            </Modal>
        </div>
    );
}
