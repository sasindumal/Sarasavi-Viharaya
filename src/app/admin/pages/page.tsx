'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    IoEyeOutline,
    IoEyeOffOutline,
    IoSaveOutline,
    IoCheckmarkCircle,
    IoNavigateOutline,
    IoReorderThreeOutline,
} from 'react-icons/io5';
import { useAuth } from '@/lib/auth';
import { getPageVisibility, updatePageVisibility } from '@/lib/firestore';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import type { PageConfig } from '@/types';

/* ─── inline styles ─── */
const s: Record<string, React.CSSProperties> = {
    page: { maxWidth: '960px', margin: '0 auto' },
    header: { marginBottom: '2rem' },
    title: {
        fontFamily: "'Cinzel', serif",
        fontSize: 'clamp(1.4rem, 3vw, 1.8rem)',
        fontWeight: 700,
        color: '#1A1919',
        display: 'flex',
        alignItems: 'center',
        gap: '0.6rem',
    },
    subtitle: {
        fontSize: '0.9rem',
        color: '#343534',
        opacity: 0.6,
        marginTop: '0.35rem',
    },
    card: {
        background: 'rgba(255,255,254,0.75)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(245,185,38,0.12)',
        borderRadius: '20px',
        overflow: 'hidden',
    },
    tableHeader: {
        display: 'grid',
        gridTemplateColumns: '2fr 1fr 1fr 1fr',
        padding: '1rem 1.5rem',
        background: 'rgba(26,25,25,0.04)',
        borderBottom: '1px solid rgba(52,53,52,0.08)',
        gap: '0.5rem',
    },
    thText: {
        fontSize: '0.72rem',
        fontWeight: 700,
        color: '#343534',
        textTransform: 'uppercase' as const,
        letterSpacing: '0.08em',
    },
    thCenter: {
        fontSize: '0.72rem',
        fontWeight: 700,
        color: '#343534',
        textTransform: 'uppercase' as const,
        letterSpacing: '0.08em',
        textAlign: 'center' as const,
    },
    row: {
        display: 'grid',
        gridTemplateColumns: '2fr 1fr 1fr 1fr',
        padding: '1rem 1.5rem',
        borderBottom: '1px solid rgba(52,53,52,0.06)',
        alignItems: 'center',
        gap: '0.5rem',
        transition: 'background 0.2s ease',
    },
    rowHover: {
        background: 'rgba(245,185,38,0.04)',
    },
    pageLabel: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.6rem',
    },
    slug: {
        fontSize: '0.78rem',
        color: '#343534',
        opacity: 0.5,
        fontFamily: 'monospace',
    },
    pageName: {
        fontSize: '0.95rem',
        fontWeight: 600,
        color: '#1A1919',
    },
    toggleWrap: {
        display: 'flex',
        justifyContent: 'center',
    },
    toggle: {
        width: '44px',
        height: '24px',
        borderRadius: '12px',
        border: 'none',
        cursor: 'pointer',
        position: 'relative' as const,
        transition: 'background 0.3s ease',
        padding: 0,
    },
    toggleOn: {
        background: 'linear-gradient(135deg, #F5B926, #ED9F2D)',
    },
    toggleOff: {
        background: 'rgba(52,53,52,0.15)',
    },
    toggleKnob: {
        width: '18px',
        height: '18px',
        borderRadius: '50%',
        background: '#fff',
        position: 'absolute' as const,
        top: '3px',
        transition: 'left 0.3s ease',
        boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
    },
    actions: {
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '0.75rem',
        marginTop: '1.5rem',
    },
    saveBtn: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.7rem 1.75rem',
        background: 'linear-gradient(135deg, #F5B926, #ED9F2D)',
        color: '#1A1919',
        border: 'none',
        borderRadius: '12px',
        fontWeight: 700,
        fontSize: '0.9rem',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
    },
    saveBtnDisabled: {
        opacity: 0.5,
        cursor: 'not-allowed',
    },
    successMsg: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.4rem',
        color: '#4CAF50',
        fontSize: '0.9rem',
        fontWeight: 600,
    },
    legend: {
        display: 'flex',
        gap: '1.5rem',
        marginTop: '1.25rem',
        flexWrap: 'wrap' as const,
    },
    legendItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.4rem',
        fontSize: '0.8rem',
        color: '#343534',
        opacity: 0.7,
    },
    legendDot: {
        width: '10px',
        height: '10px',
        borderRadius: '50%',
    },
    infoBox: {
        background: 'rgba(245,185,38,0.08)',
        border: '1px solid rgba(245,185,38,0.2)',
        borderRadius: '14px',
        padding: '1rem 1.25rem',
        marginBottom: '1.5rem',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.75rem',
    },
    infoIcon: {
        fontSize: '1.2rem',
        color: '#ED9F2D',
        flexShrink: 0,
        marginTop: '0.1rem',
    },
    infoText: {
        fontSize: '0.85rem',
        color: '#343534',
        lineHeight: 1.5,
    },
};

export default function AdminPagesPage() {
    const { appUser } = useAuth();
    const [pages, setPages] = useState<PageConfig[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [changed, setChanged] = useState(false);
    const [hoverRow, setHoverRow] = useState<number | null>(null);

    useEffect(() => {
        async function load() {
            const config = await getPageVisibility();
            setPages(config.pages);
            setLoading(false);
        }
        load();
    }, []);

    const toggle = (index: number, field: 'showInHeader' | 'showInFooter' | 'showInHome') => {
        setPages(prev => {
            const updated = [...prev];
            updated[index] = { ...updated[index], [field]: !updated[index][field] };
            return updated;
        });
        setChanged(true);
        setSaved(false);
    };

    const handleSave = async () => {
        if (!appUser) return;
        setSaving(true);
        await updatePageVisibility({
            pages,
            updatedAt: new Date().toISOString(),
            updatedBy: appUser.email,
        });
        setSaving(false);
        setSaved(true);
        setChanged(false);
        setTimeout(() => setSaved(false), 3000);
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '50vh' }}>
                <LoadingSpinner message="Loading page settings..." />
            </div>
        );
    }

    return (
        <div style={s.page}>
            <motion.div
                style={s.header}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 style={s.title}>
                    <IoNavigateOutline style={{ color: '#F5B926' }} />
                    Page Visibility
                </h1>
                <p style={s.subtitle}>
                    Control which pages appear in the website header navigation, footer links, and homepage explore section.
                </p>
            </motion.div>

            <motion.div
                style={s.infoBox}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
            >
                <IoEyeOutline style={s.infoIcon} />
                <div style={s.infoText}>
                    Toggle the switches below to show or hide pages from different areas of the website.
                    Changes take effect immediately after saving for all visitors.
                </div>
            </motion.div>

            <motion.div
                style={s.card}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15 }}
            >
                {/* Table Header */}
                <div style={s.tableHeader}>
                    <span style={s.thText}>Page</span>
                    <span style={s.thCenter}>Header Nav</span>
                    <span style={s.thCenter}>Footer Links</span>
                    <span style={s.thCenter}>Home Section</span>
                </div>

                {/* Rows */}
                {pages.map((page, i) => (
                    <div
                        key={page.slug}
                        style={{
                            ...s.row,
                            ...(hoverRow === i ? s.rowHover : {}),
                            ...(i === pages.length - 1 ? { borderBottom: 'none' } : {}),
                        }}
                        onMouseEnter={() => setHoverRow(i)}
                        onMouseLeave={() => setHoverRow(null)}
                    >
                        <div style={s.pageLabel}>
                            <IoReorderThreeOutline style={{ fontSize: '1.2rem', color: 'rgba(52,53,52,0.3)' }} />
                            <div>
                                <div style={s.pageName}>{page.label}</div>
                                <div style={s.slug}>{page.slug}</div>
                            </div>
                        </div>

                        {/* Header Toggle */}
                        <div style={s.toggleWrap}>
                            <button
                                style={{
                                    ...s.toggle,
                                    ...(page.showInHeader ? s.toggleOn : s.toggleOff),
                                }}
                                onClick={() => toggle(i, 'showInHeader')}
                                aria-label={`Toggle ${page.label} in header`}
                                id={`toggle-header-${page.slug.replace('/', '') || 'home'}`}
                            >
                                <span style={{ ...s.toggleKnob, left: page.showInHeader ? '23px' : '3px' }} />
                            </button>
                        </div>

                        {/* Footer Toggle */}
                        <div style={s.toggleWrap}>
                            <button
                                style={{
                                    ...s.toggle,
                                    ...(page.showInFooter ? s.toggleOn : s.toggleOff),
                                }}
                                onClick={() => toggle(i, 'showInFooter')}
                                aria-label={`Toggle ${page.label} in footer`}
                                id={`toggle-footer-${page.slug.replace('/', '') || 'home'}`}
                            >
                                <span style={{ ...s.toggleKnob, left: page.showInFooter ? '23px' : '3px' }} />
                            </button>
                        </div>

                        {/* Home Toggle */}
                        <div style={s.toggleWrap}>
                            <button
                                style={{
                                    ...s.toggle,
                                    ...(page.showInHome ? s.toggleOn : s.toggleOff),
                                }}
                                onClick={() => toggle(i, 'showInHome')}
                                aria-label={`Toggle ${page.label} in home section`}
                                id={`toggle-home-${page.slug.replace('/', '') || 'home'}`}
                            >
                                <span style={{ ...s.toggleKnob, left: page.showInHome ? '23px' : '3px' }} />
                            </button>
                        </div>
                    </div>
                ))}
            </motion.div>

            {/* Legend */}
            <div style={s.legend}>
                <div style={s.legendItem}>
                    <span style={{ ...s.legendDot, background: 'linear-gradient(135deg, #F5B926, #ED9F2D)' }} />
                    Visible
                </div>
                <div style={s.legendItem}>
                    <span style={{ ...s.legendDot, background: 'rgba(52,53,52,0.15)' }} />
                    Hidden
                </div>
            </div>

            {/* Actions */}
            <div style={s.actions}>
                {saved && (
                    <motion.span
                        style={s.successMsg}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <IoCheckmarkCircle /> Settings saved!
                    </motion.span>
                )}
                <button
                    style={{
                        ...s.saveBtn,
                        ...(!changed || saving ? s.saveBtnDisabled : {}),
                    }}
                    onClick={handleSave}
                    disabled={!changed || saving}
                    id="save-page-visibility"
                >
                    <IoSaveOutline />
                    {saving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>
        </div>
    );
}
