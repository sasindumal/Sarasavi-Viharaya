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
    IoHeartOutline,
    IoConstructOutline,
    IoStarOutline,
    IoFilterOutline,
} from 'react-icons/io5';
import { useAuth, canManageContent } from '@/lib/auth';
import { getAcknowledgments, createAcknowledgment, updateAcknowledgment, deleteAcknowledgment } from '@/lib/firestore';
import { uploadImage } from '@/lib/cloudinary';
import Modal from '@/components/ui/Modal';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import type { Acknowledgment } from '@/types';

type AckCategory = 'donor' | 'workforce' | 'special';

const CATEGORY_LABELS: Record<AckCategory, string> = {
    donor: 'Donor',
    workforce: 'Workforce',
    special: 'Special Mention',
};

const CATEGORY_COLORS: Record<AckCategory, string> = {
    donor: '#F5B926',
    workforce: '#ED9F2D',
    special: '#DF522A',
};

const CATEGORY_ICONS: Record<AckCategory, React.ReactNode> = {
    donor: <IoHeartOutline />,
    workforce: <IoConstructOutline />,
    special: <IoStarOutline />,
};

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
    filterBtn: {
        display: 'flex', alignItems: 'center', gap: '0.4rem',
        padding: '0.55rem 1rem', borderRadius: '12px',
        border: '1.5px solid rgba(52,53,52,0.12)', background: 'rgba(255,255,254,0.8)',
        cursor: 'pointer', fontSize: '0.82rem', color: '#343534', fontWeight: 500,
    },
    filterBtnActive: {
        display: 'flex', alignItems: 'center', gap: '0.4rem',
        padding: '0.55rem 1rem', borderRadius: '12px',
        border: '1.5px solid rgba(245,185,38,0.4)', background: 'rgba(245,185,38,0.1)',
        cursor: 'pointer', fontSize: '0.82rem', color: '#1A1919', fontWeight: 600,
    },
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
    desc: { fontSize: '0.8rem', color: 'rgba(52,53,52,0.6)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const },
    catBadge: {
        display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
        padding: '0.2rem 0.6rem', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 600,
        flexShrink: 0,
    },
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
        outline: 'none', resize: 'vertical' as const, minHeight: '80px',
    },
    select: {
        width: '100%', padding: '0.6rem 0.85rem', border: '1.5px solid rgba(52,53,52,0.12)',
        borderRadius: '10px', fontSize: '0.9rem', background: 'rgba(255,255,254,0.8)', outline: 'none',
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

// Existing hardcoded data to seed
const SEED_ACKNOWLEDGMENTS: Omit<Acknowledgment, 'id'>[] = [
    // Donors
    { name: 'Mr. Ajantha Premarathna', category: 'donor', description: 'Key supporter of stupa construction, fundraising, and tile procurement from Dubai.', order: 1 },
    { name: 'Shraddha TV', category: 'donor', description: 'Funded the construction of the Sath Budu Mandapa with seven Buddha statues.', order: 2 },
    { name: 'Dr. Bandula Abeysundara', category: 'donor', description: 'Crucial support from Canada for the main hall roof construction.', order: 3 },
    { name: 'Ven. Nalande Pawara Thero & Prof. Lilantha Samaranayake', category: 'donor', description: 'First major donors — overseeing the Sri Maha Bodhi Prakaraya and meditation hall.', order: 4 },
    { name: 'Sasun Ketha Asawaddamu Team', category: 'donor', description: 'Installed the first Buddha statue and painted the stupa multiple times.', order: 5 },
    { name: 'Ven. Welimada Saddaseela Thero', category: 'donor', description: 'Contributed the pinnacle and Chuda Maniikkaya to the stupa.', order: 6 },
    // Workforce
    { name: 'Prof. A. Atputharajah', category: 'workforce', description: 'Founding Dean of Faculty of Engineering — pivotal role in concept and registration of the Buddhist Society.', order: 7 },
    { name: 'Eng. Saliya Sampath', category: 'workforce', description: 'Senior Lecturer & Senior Treasurer — led the temple project from inception to completion.', order: 8 },
    { name: 'Eng. Suranga Karunanayake', category: 'workforce', description: 'Designed the roof structure of the main preaching hall.', order: 9 },
    { name: 'Engineering Batches E14-E21', category: 'workforce', description: 'Conducted land surveys, prepared BOQs, building plans, and countless Shramadana days.', order: 10 },
    { name: 'Technology Batches Tech 16-19', category: 'workforce', description: 'Organized Pirith chanting ceremonies and construction support.', order: 11 },
    { name: 'Agriculture Faculty Students', category: 'workforce', description: 'Planted rare and valuable plants, grass, and maintained the temple gardens.', order: 12 },
    // Special Mentions
    { name: 'Prof. Vasanthi Arasarathnam', category: 'special', description: 'Vice Chancellor who developed the concept of the spiritual hub.', order: 13 },
    { name: 'Prof. Mrs. T. Mikunthan', category: 'special', description: 'Dean of Agriculture Faculty who personally funded the replacement Buddha statue after vandalism.', order: 14 },
    { name: 'Mr. Gayal Wanaguru (E14)', category: 'special', description: 'First President of the Buddhist Society of University of Jaffna.', order: 15 },
    { name: 'Local Villagers & Businesses', category: 'special', description: 'Provided employment, materials, and community support throughout construction.', order: 16 },
    { name: 'Sanken Pvt. Ltd.', category: 'special', description: 'Provided the crane boom for relocating the sacred Bodhi tree.', order: 17 },
    { name: 'Mahamevnawa Monastery Monks', category: 'special', description: 'Spiritual guidance and advisory committee participation throughout the project.', order: 18 },
];

export default function AdminAcknowledgmentsPage() {
    const { appUser, loading: authLoading } = useAuth();
    const [items, setItems] = useState<Acknowledgment[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [catFilter, setCatFilter] = useState<AckCategory | 'all'>('all');
    const [modalOpen, setModalOpen] = useState(false);
    const [editItem, setEditItem] = useState<Acknowledgment | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<Acknowledgment | null>(null);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [seeding, setSeeding] = useState(false);

    const [form, setForm] = useState({ name: '', category: 'donor' as AckCategory, description: '', photo: '', order: 0 });

    const allowed = appUser && canManageContent(appUser.role);

    const load = async () => {
        setLoading(true);
        try { setItems(await getAcknowledgments()); } catch (e) { console.error(e); }
        setLoading(false);
    };

    useEffect(() => { load(); }, []);

    const filtered = items.filter(a => {
        if (catFilter !== 'all' && a.category !== catFilter) return false;
        if (!search) return true;
        const q = search.toLowerCase();
        return a.name.toLowerCase().includes(q) || a.description.toLowerCase().includes(q);
    });

    const openNew = () => {
        setEditItem(null);
        setForm({ name: '', category: catFilter !== 'all' ? catFilter : 'donor', description: '', photo: '', order: items.length + 1 });
        setModalOpen(true);
    };

    const openEdit = (a: Acknowledgment) => {
        setEditItem(a);
        setForm({ name: a.name, category: a.category, description: a.description, photo: a.photo || '', order: a.order });
        setModalOpen(true);
    };

    const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        try {
            const url = await uploadImage(file);
            setForm(f => ({ ...f, photo: url }));
        } catch (err) { console.error(err); }
        setUploading(false);
    };

    const handleSave = async () => {
        if (!form.name || !form.description) return;
        setSaving(true);
        try {
            const data = {
                name: form.name,
                category: form.category,
                description: form.description,
                photo: form.photo || undefined,
                order: form.order,
            };
            if (editItem) {
                await updateAcknowledgment(editItem.id, data);
            } else {
                await createAcknowledgment(data as Omit<Acknowledgment, 'id'>);
            }
            setModalOpen(false);
            await load();
        } catch (err) { console.error(err); }
        setSaving(false);
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        try {
            await deleteAcknowledgment(deleteTarget.id);
            setDeleteTarget(null);
            await load();
        } catch (err) { console.error(err); }
    };

    const handleReorder = async (id: string, direction: 'up' | 'down') => {
        const list = filtered;
        const idx = list.findIndex(a => a.id === id);
        if (idx < 0) return;
        const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
        if (swapIdx < 0 || swapIdx >= list.length) return;
        try {
            await updateAcknowledgment(list[idx].id, { order: list[swapIdx].order });
            await updateAcknowledgment(list[swapIdx].id, { order: list[idx].order });
            await load();
        } catch (err) { console.error(err); }
    };

    const handleSeedExisting = async () => {
        if (items.length > 0) return;
        setSeeding(true);
        try {
            for (const a of SEED_ACKNOWLEDGMENTS) {
                await createAcknowledgment(a);
            }
            await load();
        } catch (err) { console.error(err); }
        setSeeding(false);
    };

    if (authLoading || loading) return <LoadingSpinner message="Loading acknowledgments..." />;
    if (!allowed) return <p style={{ padding: '2rem' }}>You don&apos;t have permission to view this page.</p>;

    return (
        <div>
            <div style={s.header}>
                <h1 style={s.title}>Acknowledgments</h1>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {items.length === 0 && (
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
                        <IoAddOutline /> Add Acknowledgment
                    </button>
                </div>
            </div>

            <div style={s.searchRow}>
                <div style={s.searchWrap}>
                    <IoSearchOutline style={s.searchIcon} />
                    <input style={s.searchInput} placeholder="Search acknowledgments..." value={search} onChange={e => setSearch(e.target.value)} />
                </div>
                {(['all', 'donor', 'workforce', 'special'] as const).map(cat => (
                    <button
                        key={cat}
                        onClick={() => setCatFilter(cat)}
                        style={catFilter === cat ? s.filterBtnActive : s.filterBtn}
                    >
                        {cat === 'all' ? <IoFilterOutline /> : CATEGORY_ICONS[cat]}
                        {cat === 'all' ? 'All' : CATEGORY_LABELS[cat]}
                    </button>
                ))}
            </div>

            <motion.div style={s.card} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
                {filtered.length === 0 ? (
                    <div style={s.empty}>
                        <IoPersonOutline style={{ fontSize: '2.5rem', opacity: 0.3, marginBottom: '0.75rem' }} />
                        <p style={{ margin: 0, fontWeight: 500 }}>{search || catFilter !== 'all' ? 'No matches' : 'No acknowledgments yet'}</p>
                    </div>
                ) : (
                    <AnimatePresence>
                        {filtered.map((a, idx) => (
                            <motion.div key={a.id} style={s.row} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, height: 0 }}>
                                <div style={{ ...s.avatar, background: `${CATEGORY_COLORS[a.category]}18`, color: CATEGORY_COLORS[a.category] }}>
                                    {a.photo ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img src={a.photo} alt={a.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        CATEGORY_ICONS[a.category]
                                    )}
                                </div>
                                <div style={s.info}>
                                    <div style={s.name}>{a.name}</div>
                                    <div style={s.desc}>{a.description}</div>
                                </div>
                                <span style={{
                                    ...s.catBadge,
                                    background: `${CATEGORY_COLORS[a.category]}15`,
                                    color: CATEGORY_COLORS[a.category],
                                }}>
                                    {CATEGORY_LABELS[a.category]}
                                </span>
                                <span style={{ fontSize: '0.75rem', color: 'rgba(52,53,52,0.4)', flexShrink: 0 }}>#{a.order}</span>
                                <div style={s.actions}>
                                    <button style={{ ...s.iconBtn, background: 'rgba(52,53,52,0.06)', color: '#343534' }} onClick={() => handleReorder(a.id, 'up')} disabled={idx === 0} title="Move up"><IoArrowUpOutline /></button>
                                    <button style={{ ...s.iconBtn, background: 'rgba(52,53,52,0.06)', color: '#343534' }} onClick={() => handleReorder(a.id, 'down')} disabled={idx === filtered.length - 1} title="Move down"><IoArrowDownOutline /></button>
                                    <button style={{ ...s.iconBtn, background: 'rgba(245,185,38,0.1)', color: '#d9a01e' }} onClick={() => openEdit(a)} title="Edit"><IoCreateOutline /></button>
                                    <button style={{ ...s.iconBtn, background: 'rgba(223,82,42,0.08)', color: '#DF522A' }} onClick={() => setDeleteTarget(a)} title="Delete"><IoTrashOutline /></button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                )}
            </motion.div>

            {/* Create / Edit Modal */}
            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editItem ? 'Edit Acknowledgment' : 'Add Acknowledgment'}>
                <div style={s.formGroup}>
                    <label style={s.label}>Name *</label>
                    <input style={s.input} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Prof. A. Atputharajah" />
                </div>
                <div style={s.formGroup}>
                    <label style={s.label}>Category *</label>
                    <select style={s.select} value={form.category} onChange={e => setForm({ ...form, category: e.target.value as AckCategory })}>
                        <option value="donor">Donor</option>
                        <option value="workforce">Workforce</option>
                        <option value="special">Special Mention</option>
                    </select>
                </div>
                <div style={s.formGroup}>
                    <label style={s.label}>Description *</label>
                    <textarea style={s.textarea} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Contribution or role description..." />
                </div>
                <div style={s.formGroup}>
                    <label style={s.label}>Photo</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        {form.photo && (
                            <div style={{ position: 'relative' }}>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={form.photo} alt="Preview" style={s.photoPreview} />
                                <button onClick={() => setForm({ ...form, photo: '' })} style={{ position: 'absolute', top: -6, right: -6, width: 20, height: 20, borderRadius: '50%', border: 'none', background: '#DF522A', color: '#fff', fontSize: '0.7rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><IoCloseOutline /></button>
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
                    <button onClick={handleSave} disabled={saving || !form.name || !form.description} style={{ padding: '0.5rem 1.25rem', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg, #F5B926, #ED9F2D)', color: '#1A1919', fontWeight: 600, cursor: 'pointer', opacity: saving ? 0.6 : 1 }}>
                        {saving ? 'Saving...' : editItem ? 'Update' : 'Create'}
                    </button>
                </div>
            </Modal>

            {/* Delete Modal */}
            <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete Acknowledgment">
                <p style={{ margin: '0 0 1.5rem', fontSize: '0.9rem', color: '#343534' }}>
                    Remove <strong>{deleteTarget?.name}</strong> from acknowledgments?
                </p>
                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                    <button onClick={() => setDeleteTarget(null)} style={{ padding: '0.5rem 1.25rem', borderRadius: '10px', border: '1.5px solid rgba(52,53,52,0.12)', background: 'transparent', cursor: 'pointer' }}>Cancel</button>
                    <button onClick={handleDelete} style={{ padding: '0.5rem 1.25rem', borderRadius: '10px', border: 'none', background: '#DF522A', color: '#fff', fontWeight: 600, cursor: 'pointer' }}>Delete</button>
                </div>
            </Modal>
        </div>
    );
}
