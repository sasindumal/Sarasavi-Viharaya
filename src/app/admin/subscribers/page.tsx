'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    IoMailOutline,
    IoSearchOutline,
    IoTrashOutline,
    IoPersonOutline,
    IoTimeOutline,
    IoCheckmarkCircleOutline,
    IoCloseCircleOutline,
    IoToggleOutline,
    IoAddOutline,
    IoNotificationsOutline,
} from 'react-icons/io5';
import { useAuth, canManageContent } from '@/lib/auth';
import { getAllSubscribers, addSubscriber, removeSubscriber, deleteSubscriber } from '@/lib/firestore';
import Modal from '@/components/ui/Modal';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import type { Subscriber } from '@/types';

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
    stats: {
        display: 'flex',
        gap: '0.75rem',
        flexWrap: 'wrap' as const,
    },
    statBadge: {
        padding: '0.35rem 0.9rem',
        borderRadius: '20px',
        fontSize: '0.8rem',
        fontWeight: 600,
    },
    controls: {
        display: 'flex',
        gap: '0.75rem',
        marginBottom: '1.5rem',
        flexWrap: 'wrap' as const,
    },
    searchWrap: {
        position: 'relative' as const,
        flex: 1,
        minWidth: '200px',
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
    searchIcon: {
        position: 'absolute' as const,
        left: '0.75rem',
        top: '50%',
        transform: 'translateY(-50%)',
        color: '#343534',
        opacity: 0.4,
    },
    filterBtn: {
        padding: '0.65rem 1.2rem',
        borderRadius: '12px',
        border: '1.5px solid rgba(52,53,52,0.12)',
        background: 'rgba(255,255,254,0.8)',
        cursor: 'pointer',
        fontSize: '0.85rem',
        fontWeight: 500,
        transition: 'all 0.2s',
    },
    filterBtnActive: {
        background: 'linear-gradient(135deg, #F5B926, #ED9F2D)',
        border: '1.5px solid transparent',
        color: '#1A1919',
        fontWeight: 600,
    },
    addBtn: {
        padding: '0.65rem 1.2rem',
        borderRadius: '12px',
        border: 'none',
        background: 'linear-gradient(135deg, #F5B926, #ED9F2D)',
        cursor: 'pointer',
        fontSize: '0.85rem',
        fontWeight: 600,
        color: '#1A1919',
        display: 'flex',
        alignItems: 'center',
        gap: '0.4rem',
        transition: 'all 0.2s',
    },
    card: {
        background: 'rgba(255,255,254,0.75)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(245,185,38,0.12)',
        borderRadius: '16px',
        overflow: 'hidden',
    },
    row: {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        padding: '1rem 1.25rem',
        borderBottom: '1px solid rgba(52,53,52,0.06)',
        transition: 'background 0.15s',
    },
    activeRow: {
        borderLeft: '3px solid #4CAF50',
    },
    inactiveRow: {
        borderLeft: '3px solid rgba(223,82,42,0.5)',
        opacity: 0.65,
    },
    avatar: {
        width: '42px',
        height: '42px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        fontSize: '1.1rem',
        fontWeight: 700,
        color: '#FFFFFE',
    },
    info: {
        flex: 1,
        minWidth: 0,
    },
    email: {
        fontSize: '0.9rem',
        fontWeight: 600,
        color: '#1A1919',
        marginBottom: '2px',
    },
    name: {
        fontSize: '0.8rem',
        color: 'rgba(52,53,52,0.6)',
    },
    meta: {
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'flex-end',
        gap: '0.35rem',
        flexShrink: 0,
    },
    time: {
        fontSize: '0.75rem',
        color: 'rgba(52,53,52,0.5)',
        whiteSpace: 'nowrap' as const,
    },
    statusBadge: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.25rem',
        padding: '0.2rem 0.6rem',
        borderRadius: '12px',
        fontSize: '0.7rem',
        fontWeight: 600,
    },
    activeBadge: {
        background: 'rgba(76,175,80,0.12)',
        color: '#388E3C',
    },
    inactiveBadge: {
        background: 'rgba(223,82,42,0.1)',
        color: '#DF522A',
    },
    actions: {
        display: 'flex',
        gap: '0.35rem',
    },
    iconBtn: {
        width: '32px',
        height: '32px',
        borderRadius: '8px',
        border: 'none',
        background: 'rgba(52,53,52,0.06)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '0.9rem',
        color: '#343534',
        transition: 'all 0.2s',
    },
    deactivateBtn: {
        color: '#ED6C02',
        background: 'rgba(237,108,2,0.08)',
    },
    activateBtn: {
        color: '#388E3C',
        background: 'rgba(76,175,80,0.08)',
    },
    deleteBtn: {
        color: '#DF522A',
        background: 'rgba(223,82,42,0.08)',
    },
    empty: {
        textAlign: 'center' as const,
        padding: '4rem 2rem',
        color: 'rgba(52,53,52,0.5)',
    },
    formGroup: {
        marginBottom: '1rem',
    },
    formLabel: {
        display: 'block',
        fontSize: '0.85rem',
        fontWeight: 600,
        color: '#1A1919',
        marginBottom: '0.4rem',
    },
    formInput: {
        width: '100%',
        padding: '0.65rem 1rem',
        border: '1.5px solid rgba(52,53,52,0.15)',
        borderRadius: '12px',
        fontSize: '0.9rem',
        background: 'rgba(255,255,254,0.9)',
        outline: 'none',
    },
    formActions: {
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '0.75rem',
        marginTop: '1.25rem',
    },
    cancelBtn: {
        padding: '0.6rem 1.25rem',
        borderRadius: '12px',
        border: '1.5px solid rgba(52,53,52,0.15)',
        background: 'transparent',
        cursor: 'pointer',
        fontSize: '0.85rem',
        fontWeight: 500,
    },
    submitBtn: {
        padding: '0.6rem 1.5rem',
        borderRadius: '12px',
        border: 'none',
        background: 'linear-gradient(135deg, #F5B926, #ED9F2D)',
        cursor: 'pointer',
        fontSize: '0.85rem',
        fontWeight: 600,
        color: '#1A1919',
    },
};

type Filter = 'all' | 'active' | 'inactive';

export default function AdminSubscribersPage() {
    const { user, appUser } = useAuth();
    const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState<Filter>('all');
    const [showAddModal, setShowAddModal] = useState(false);
    const [addEmail, setAddEmail] = useState('');
    const [addName, setAddName] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        loadSubscribers();
    }, []);

    async function loadSubscribers() {
        setLoading(true);
        try {
            const data = await getAllSubscribers();
            setSubscribers(data);
        } catch (err) {
            console.error('Failed to load subscribers:', err);
        }
        setLoading(false);
    }

    if (!user || !appUser || !canManageContent(appUser.role)) {
        return <LoadingSpinner />;
    }

    const activeCount = subscribers.filter(s => s.isActive).length;
    const inactiveCount = subscribers.filter(s => !s.isActive).length;

    const filtered = subscribers.filter(sub => {
        const matchesSearch =
            sub.email.toLowerCase().includes(search.toLowerCase()) ||
            (sub.name && sub.name.toLowerCase().includes(search.toLowerCase()));
        const matchesFilter =
            filter === 'all' ||
            (filter === 'active' && sub.isActive) ||
            (filter === 'inactive' && !sub.isActive);
        return matchesSearch && matchesFilter;
    }).sort((a, b) => new Date(b.subscribedAt).getTime() - new Date(a.subscribedAt).getTime());

    async function handleToggle(sub: Subscriber) {
        try {
            if (sub.isActive) {
                await removeSubscriber(sub.id);
            } else {
                await addSubscriber(sub.email, sub.name);
            }
            await loadSubscribers();
        } catch (err) {
            console.error('Failed to toggle subscriber:', err);
        }
    }

    async function handleDelete(sub: Subscriber) {
        if (!confirm(`Permanently delete subscriber "${sub.email}"?`)) return;
        try {
            await deleteSubscriber(sub.id);
            await loadSubscribers();
        } catch (err) {
            console.error('Failed to delete subscriber:', err);
        }
    }

    async function handleAdd() {
        if (!addEmail.trim()) return;
        setSaving(true);
        try {
            await addSubscriber(addEmail.trim(), addName.trim());
            setAddEmail('');
            setAddName('');
            setShowAddModal(false);
            await loadSubscribers();
        } catch (err) {
            console.error('Failed to add subscriber:', err);
        }
        setSaving(false);
    }

    function formatDate(iso: string) {
        try {
            return new Date(iso).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
            });
        } catch {
            return iso;
        }
    }

    function getAvatarColor(email: string) {
        const colors = ['#F5B926', '#ED9F2D', '#4CAF50', '#2196F3', '#9C27B0', '#FF5722', '#607D8B'];
        const i = email.charCodeAt(0) % colors.length;
        return colors[i];
    }

    return (
        <div>
            {/* Header */}
            <div style={s.header}>
                <h1 style={s.title}>
                    <IoNotificationsOutline style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
                    Subscribers
                </h1>
                <div style={s.stats}>
                    <span style={{ ...s.statBadge, background: 'rgba(76,175,80,0.12)', color: '#388E3C' }}>
                        {activeCount} Active
                    </span>
                    <span style={{ ...s.statBadge, background: 'rgba(223,82,42,0.1)', color: '#DF522A' }}>
                        {inactiveCount} Inactive
                    </span>
                    <span style={{ ...s.statBadge, background: 'rgba(33,150,243,0.1)', color: '#1976D2' }}>
                        {subscribers.length} Total
                    </span>
                </div>
            </div>

            {/* Controls */}
            <div style={s.controls}>
                <div style={s.searchWrap}>
                    <IoSearchOutline style={s.searchIcon} />
                    <input
                        type="text"
                        placeholder="Search by email or name..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        style={s.searchInput}
                    />
                </div>
                {(['all', 'active', 'inactive'] as Filter[]).map(f => (
                    <button
                        key={f}
                        style={{ ...s.filterBtn, ...(filter === f ? s.filterBtnActive : {}) }}
                        onClick={() => setFilter(f)}
                    >
                        {f === 'all' ? 'All' : f === 'active' ? 'Active' : 'Inactive'}
                    </button>
                ))}
                <button style={s.addBtn} onClick={() => setShowAddModal(true)}>
                    <IoAddOutline /> Add Subscriber
                </button>
            </div>

            {/* List */}
            {loading ? (
                <LoadingSpinner />
            ) : filtered.length === 0 ? (
                <div style={s.card}>
                    <div style={s.empty}>
                        <IoMailOutline style={{ fontSize: '2.5rem', marginBottom: '0.75rem', opacity: 0.3 }} />
                        <p style={{ fontSize: '1rem', fontWeight: 500, marginBottom: '0.25rem' }}>No subscribers found</p>
                        <p style={{ fontSize: '0.85rem' }}>
                            {search ? 'Try a different search term' : 'Subscribers will appear here when people subscribe'}
                        </p>
                    </div>
                </div>
            ) : (
                <div style={s.card}>
                    <AnimatePresence>
                        {filtered.map(sub => (
                            <motion.div
                                key={sub.id}
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, height: 0 }}
                                style={{
                                    ...s.row,
                                    ...(sub.isActive ? s.activeRow : s.inactiveRow),
                                }}
                            >
                                <div
                                    style={{
                                        ...s.avatar,
                                        background: `linear-gradient(135deg, ${getAvatarColor(sub.email)}, ${getAvatarColor(sub.email)}dd)`,
                                    }}
                                >
                                    {sub.email.charAt(0).toUpperCase()}
                                </div>

                                <div style={s.info}>
                                    <div style={s.email}>{sub.email}</div>
                                    {sub.name && <div style={s.name}><IoPersonOutline style={{ fontSize: '0.7rem', marginRight: '0.25rem' }} />{sub.name}</div>}
                                </div>

                                <div style={s.meta}>
                                    <div style={s.time}>
                                        <IoTimeOutline style={{ fontSize: '0.7rem', marginRight: '0.2rem', verticalAlign: 'middle' }} />
                                        {formatDate(sub.subscribedAt)}
                                    </div>
                                    <span style={{ ...s.statusBadge, ...(sub.isActive ? s.activeBadge : s.inactiveBadge) }}>
                                        {sub.isActive ? (
                                            <><IoCheckmarkCircleOutline /> Active</>
                                        ) : (
                                            <><IoCloseCircleOutline /> Inactive</>
                                        )}
                                    </span>
                                </div>

                                <div style={s.actions}>
                                    <button
                                        style={{ ...s.iconBtn, ...(sub.isActive ? s.deactivateBtn : s.activateBtn) }}
                                        onClick={() => handleToggle(sub)}
                                        title={sub.isActive ? 'Deactivate' : 'Reactivate'}
                                    >
                                        <IoToggleOutline />
                                    </button>
                                    <button
                                        style={{ ...s.iconBtn, ...s.deleteBtn }}
                                        onClick={() => handleDelete(sub)}
                                        title="Delete permanently"
                                    >
                                        <IoTrashOutline />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {/* Add Subscriber Modal */}
            <Modal title="Add Subscriber" isOpen={showAddModal} onClose={() => setShowAddModal(false)}>
                <div style={s.formGroup}>
                    <label style={s.formLabel}>Email *</label>
                    <input
                        type="email"
                        value={addEmail}
                        onChange={e => setAddEmail(e.target.value)}
                        placeholder="subscriber@example.com"
                        style={s.formInput}
                    />
                </div>
                <div style={s.formGroup}>
                    <label style={s.formLabel}>Name (optional)</label>
                    <input
                        type="text"
                        value={addName}
                        onChange={e => setAddName(e.target.value)}
                        placeholder="Full name"
                        style={s.formInput}
                    />
                </div>
                <div style={s.formActions}>
                    <button style={s.cancelBtn} onClick={() => setShowAddModal(false)}>Cancel</button>
                    <button style={s.submitBtn} onClick={handleAdd} disabled={saving || !addEmail.trim()}>
                        {saving ? 'Adding...' : 'Add Subscriber'}
                    </button>
                </div>
            </Modal>
        </div>
    );
}
