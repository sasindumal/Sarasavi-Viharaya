'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    IoMailOutline,
    IoMailOpenOutline,
    IoTrashOutline,
    IoSearchOutline,
    IoEyeOutline,
    IoCheckmarkDoneOutline,
    IoChevronBackOutline,
    IoPersonOutline,
    IoTimeOutline,
} from 'react-icons/io5';
import { useAuth, canManageContent } from '@/lib/auth';
import { getContactMessages, markMessageRead, deleteContactMessage } from '@/lib/firestore';
import Modal from '@/components/ui/Modal';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import type { ContactMessage } from '@/types';

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
        gap: '1rem',
        flexWrap: 'wrap' as const,
    },
    statBadge: {
        padding: '0.35rem 0.9rem',
        borderRadius: '20px',
        fontSize: '0.8rem',
        fontWeight: 600,
    },
    searchRow: {
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
    card: {
        background: 'rgba(255,255,254,0.75)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(245,185,38,0.12)',
        borderRadius: '16px',
        overflow: 'hidden',
    },
    messageRow: {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        padding: '1rem 1.25rem',
        borderBottom: '1px solid rgba(52,53,52,0.06)',
        cursor: 'pointer',
        transition: 'background 0.15s',
    },
    unreadRow: {
        background: 'rgba(245,185,38,0.06)',
        borderLeft: '3px solid #F5B926',
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
    messageContent: {
        flex: 1,
        minWidth: 0,
    },
    senderName: {
        fontSize: '0.9rem',
        fontWeight: 600,
        color: '#1A1919',
        marginBottom: '2px',
    },
    subject: {
        fontSize: '0.85rem',
        fontWeight: 500,
        color: '#343534',
        marginBottom: '2px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap' as const,
    },
    preview: {
        fontSize: '0.8rem',
        color: 'rgba(52,53,52,0.6)',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap' as const,
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
    deleteBtn: {
        color: '#DF522A',
        background: 'rgba(223,82,42,0.08)',
    },
    empty: {
        textAlign: 'center' as const,
        padding: '4rem 2rem',
        color: 'rgba(52,53,52,0.5)',
    },
    /* Detail view */
    detailHeader: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        marginBottom: '1.5rem',
    },
    backBtn: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.4rem',
        padding: '0.5rem 1rem',
        borderRadius: '10px',
        border: '1.5px solid rgba(52,53,52,0.12)',
        background: 'rgba(255,255,254,0.8)',
        cursor: 'pointer',
        fontSize: '0.85rem',
        fontWeight: 500,
        color: '#343534',
    },
    detailCard: {
        background: 'rgba(255,255,254,0.85)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(245,185,38,0.12)',
        borderRadius: '20px',
        padding: '2rem',
    },
    detailSubject: {
        fontFamily: "'Cinzel', serif",
        fontSize: '1.3rem',
        fontWeight: 700,
        color: '#1A1919',
        marginBottom: '1.25rem',
    },
    detailMeta: {
        display: 'flex',
        gap: '1.5rem',
        flexWrap: 'wrap' as const,
        marginBottom: '1.5rem',
        padding: '1rem 1.25rem',
        background: 'rgba(245,185,38,0.06)',
        borderRadius: '12px',
    },
    metaItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        fontSize: '0.85rem',
        color: '#343534',
    },
    metaIcon: {
        color: '#F5B926',
        fontSize: '1rem',
    },
    detailBody: {
        fontSize: '0.95rem',
        lineHeight: 1.75,
        color: '#343534',
        whiteSpace: 'pre-wrap' as const,
        padding: '1.5rem 0',
        borderTop: '1px solid rgba(52,53,52,0.08)',
    },
    replyBtn: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.7rem 1.5rem',
        borderRadius: '25px',
        border: 'none',
        background: 'linear-gradient(135deg, #F5B926, #ED9F2D)',
        color: '#1A1919',
        fontSize: '0.9rem',
        fontWeight: 600,
        cursor: 'pointer',
        textDecoration: 'none',
        marginTop: '0.5rem',
    },
    detailActions: {
        display: 'flex',
        gap: '0.75rem',
        marginTop: '1.5rem',
        paddingTop: '1.25rem',
        borderTop: '1px solid rgba(52,53,52,0.08)',
        flexWrap: 'wrap' as const,
    },
    actionBtn: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.55rem 1.1rem',
        borderRadius: '10px',
        border: '1.5px solid rgba(52,53,52,0.12)',
        background: 'rgba(255,255,254,0.8)',
        cursor: 'pointer',
        fontSize: '0.82rem',
        fontWeight: 500,
        color: '#343534',
    },
};

const COLORS = ['#F5B926', '#ED9F2D', '#DF522A', '#3b82f6', '#10b981', '#8b5cf6'];

function getAvatarColor(name: string) {
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return COLORS[Math.abs(hash) % COLORS.length];
}

function formatDate(iso: string) {
    const d = new Date(iso);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHrs = Math.floor(diffMins / 60);
    if (diffHrs < 24) return `${diffHrs}h ago`;
    const diffDays = Math.floor(diffHrs / 24);
    if (diffDays < 7) return `${diffDays}d ago`;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: d.getFullYear() !== now.getFullYear() ? 'numeric' : undefined });
}

function formatFullDate(iso: string) {
    return new Date(iso).toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
        hour: 'numeric', minute: '2-digit',
    });
}

export default function AdminMessagesPage() {
    const { appUser, loading: authLoading } = useAuth();
    const [messages, setMessages] = useState<ContactMessage[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
    const [selected, setSelected] = useState<ContactMessage | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<ContactMessage | null>(null);

    const allowed = appUser && canManageContent(appUser.role);

    const load = async () => {
        setLoading(true);
        try {
            const data = await getContactMessages();
            setMessages(data);
        } catch (e) {
            console.error('Failed to load messages:', e);
        }
        setLoading(false);
    };

    useEffect(() => { load(); }, []);

    const unreadCount = messages.filter(m => !m.isRead).length;

    const filtered = messages.filter(m => {
        if (filter === 'unread' && m.isRead) return false;
        if (filter === 'read' && !m.isRead) return false;
        if (search) {
            const q = search.toLowerCase();
            return (
                m.name.toLowerCase().includes(q) ||
                m.email.toLowerCase().includes(q) ||
                m.subject.toLowerCase().includes(q) ||
                m.message.toLowerCase().includes(q)
            );
        }
        return true;
    });

    const handleToggleRead = async (msg: ContactMessage, e?: React.MouseEvent) => {
        e?.stopPropagation();
        try {
            await markMessageRead(msg.id, !msg.isRead);
            setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, isRead: !m.isRead } : m));
            if (selected?.id === msg.id) setSelected({ ...msg, isRead: !msg.isRead });
        } catch (err) {
            console.error('Failed to toggle read:', err);
        }
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        try {
            await deleteContactMessage(deleteTarget.id);
            setMessages(prev => prev.filter(m => m.id !== deleteTarget.id));
            if (selected?.id === deleteTarget.id) setSelected(null);
            setDeleteTarget(null);
        } catch (err) {
            console.error('Failed to delete:', err);
        }
    };

    const openMessage = async (msg: ContactMessage) => {
        setSelected(msg);
        if (!msg.isRead) {
            try {
                await markMessageRead(msg.id, true);
                setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, isRead: true } : m));
            } catch (err) {
                console.error(err);
            }
        }
    };

    if (authLoading || loading) return <LoadingSpinner message="Loading messages..." />;
    if (!allowed) return <p style={{ padding: '2rem' }}>You don&apos;t have permission to view this page.</p>;

    /* ===== DETAIL VIEW ===== */
    if (selected) {
        return (
            <div>
                <div style={s.detailHeader}>
                    <button style={s.backBtn} onClick={() => setSelected(null)}>
                        <IoChevronBackOutline /> Back
                    </button>
                    <span style={{ ...s.statBadge, background: selected.isRead ? 'rgba(52,53,52,0.08)' : 'rgba(245,185,38,0.15)', color: selected.isRead ? '#343534' : '#d9a01e' }}>
                        {selected.isRead ? 'Read' : 'Unread'}
                    </span>
                </div>

                <motion.div style={s.detailCard} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
                    <h1 style={s.detailSubject}>{selected.subject}</h1>

                    <div style={s.detailMeta}>
                        <div style={s.metaItem}>
                            <IoPersonOutline style={s.metaIcon} />
                            <strong>{selected.name}</strong>
                        </div>
                        <div style={s.metaItem}>
                            <IoMailOutline style={s.metaIcon} />
                            <a href={`mailto:${selected.email}`} style={{ color: '#d9a01e', textDecoration: 'none' }}>{selected.email}</a>
                        </div>
                        <div style={s.metaItem}>
                            <IoTimeOutline style={s.metaIcon} />
                            {formatFullDate(selected.createdAt)}
                        </div>
                    </div>

                    <div style={s.detailBody}>{selected.message}</div>

                    <a
                        href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject)}`}
                        style={s.replyBtn}
                    >
                        <IoMailOutline /> Reply via Email
                    </a>

                    <div style={s.detailActions}>
                        <button style={s.actionBtn} onClick={() => handleToggleRead(selected)}>
                            {selected.isRead ? <><IoMailOutline /> Mark Unread</> : <><IoCheckmarkDoneOutline /> Mark Read</>}
                        </button>
                        <button style={{ ...s.actionBtn, color: '#DF522A', borderColor: 'rgba(223,82,42,0.25)' }} onClick={() => setDeleteTarget(selected)}>
                            <IoTrashOutline /> Delete
                        </button>
                    </div>
                </motion.div>

                {/* Delete modal */}
                <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete Message?">
                    <h3 style={{ margin: '0 0 0.75rem', fontFamily: "'Cinzel', serif" }}>Delete Message?</h3>
                    <p style={{ margin: '0 0 1.5rem', fontSize: '0.9rem', color: '#343534' }}>
                        This will permanently remove this message from <strong>{deleteTarget?.name}</strong>.
                    </p>
                    <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                        <button onClick={() => setDeleteTarget(null)} style={{ padding: '0.5rem 1.25rem', borderRadius: '10px', border: '1.5px solid rgba(52,53,52,0.12)', background: 'transparent', cursor: 'pointer' }}>Cancel</button>
                        <button onClick={handleDelete} style={{ padding: '0.5rem 1.25rem', borderRadius: '10px', border: 'none', background: '#DF522A', color: '#fff', fontWeight: 600, cursor: 'pointer' }}>Delete</button>
                    </div>
                </Modal>
            </div>
        );
    }

    /* ===== LIST VIEW ===== */
    return (
        <div>
            <div style={s.header}>
                <h1 style={s.title}>Messages</h1>
                <div style={s.stats}>
                    <span style={{ ...s.statBadge, background: 'rgba(245,185,38,0.12)', color: '#d9a01e' }}>
                        {unreadCount} unread
                    </span>
                    <span style={{ ...s.statBadge, background: 'rgba(52,53,52,0.06)', color: '#343534' }}>
                        {messages.length} total
                    </span>
                </div>
            </div>

            <div style={s.searchRow}>
                <div style={s.searchWrap}>
                    <IoSearchOutline style={s.searchIcon} />
                    <input
                        type="text"
                        placeholder="Search messages..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        style={s.searchInput}
                    />
                </div>
                {(['all', 'unread', 'read'] as const).map(f => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        style={{ ...s.filterBtn, ...(filter === f ? s.filterBtnActive : {}) }}
                    >
                        {f.charAt(0).toUpperCase() + f.slice(1)}
                    </button>
                ))}
            </div>

            <motion.div style={s.card} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
                {filtered.length === 0 ? (
                    <div style={s.empty}>
                        <IoMailOutline style={{ fontSize: '2.5rem', opacity: 0.3, marginBottom: '0.75rem' }} />
                        <p style={{ margin: 0, fontWeight: 500 }}>
                            {search || filter !== 'all' ? 'No messages match your search' : 'No messages yet'}
                        </p>
                    </div>
                ) : (
                    <AnimatePresence>
                        {filtered.map(msg => (
                            <motion.div
                                key={msg.id}
                                style={{
                                    ...s.messageRow,
                                    ...(!msg.isRead ? s.unreadRow : {}),
                                }}
                                onClick={() => openMessage(msg)}
                                whileHover={{ background: 'rgba(245,185,38,0.08)' }}
                                layout
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0, height: 0 }}
                            >
                                <div style={{ ...s.avatar, background: getAvatarColor(msg.name) }}>
                                    {msg.name.charAt(0).toUpperCase()}
                                </div>
                                <div style={s.messageContent}>
                                    <div style={{ ...s.senderName, fontWeight: msg.isRead ? 500 : 700 }}>{msg.name}</div>
                                    <div style={{ ...s.subject, fontWeight: msg.isRead ? 400 : 600 }}>{msg.subject}</div>
                                    <div style={s.preview}>{msg.message}</div>
                                </div>
                                <div style={s.meta}>
                                    <span style={s.time}>{formatDate(msg.createdAt)}</span>
                                    <div style={s.actions}>
                                        <button
                                            style={s.iconBtn}
                                            title={msg.isRead ? 'Mark unread' : 'Mark read'}
                                            onClick={e => handleToggleRead(msg, e)}
                                        >
                                            {msg.isRead ? <IoMailOutline /> : <IoMailOpenOutline />}
                                        </button>
                                        <button
                                            style={{ ...s.iconBtn, ...s.deleteBtn }}
                                            title="Delete"
                                            onClick={e => { e.stopPropagation(); setDeleteTarget(msg); }}
                                        >
                                            <IoTrashOutline />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                )}
            </motion.div>

            {/* Delete confirmation modal */}
            <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete Message">
                <h3 style={{ margin: '0 0 0.75rem', fontFamily: "'Cinzel', serif" }}>Delete Message?</h3>
                <p style={{ margin: '0 0 1.5rem', fontSize: '0.9rem', color: '#343534' }}>
                    This will permanently remove this message from <strong>{deleteTarget?.name}</strong>.
                </p>
                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                    <button onClick={() => setDeleteTarget(null)} style={{ padding: '0.5rem 1.25rem', borderRadius: '10px', border: '1.5px solid rgba(52,53,52,0.12)', background: 'transparent', cursor: 'pointer' }}>Cancel</button>
                    <button onClick={handleDelete} style={{ padding: '0.5rem 1.25rem', borderRadius: '10px', border: 'none', background: '#DF522A', color: '#fff', fontWeight: 600, cursor: 'pointer' }}>Delete</button>
                </div>
            </Modal>
        </div>
    );
}
