'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    IoCalendarOutline,
    IoFlagOutline,
    IoPeopleOutline,
    IoTrendingUpOutline,
    IoAddOutline,
    IoCloudOutline,
    IoImagesOutline,
    IoSwapHorizontalOutline,
} from 'react-icons/io5';
import { GiLotusFlower } from 'react-icons/gi';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { getEvents, getMilestones, getSubscribers } from '@/lib/firestore';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface StatCard {
    label: string;
    value: string;
    icon: React.ReactNode;
    color: string;
    href: string;
}

const stats: StatCard[] = [
    { label: 'Events', value: '6', icon: <IoCalendarOutline />, color: '#F5B926', href: '/admin/events' },
    { label: 'Milestones', value: '13', icon: <IoFlagOutline />, color: '#ED9F2D', href: '/admin/milestones' },
    { label: 'Subscribers', value: '—', icon: <IoPeopleOutline />, color: '#4CAF50', href: '/admin/subscribers' },
    { label: 'Growth', value: '+12%', icon: <IoTrendingUpOutline />, color: '#2196F3', href: '#' },
];

const quickActions = [
    { label: 'New Event', href: '/admin/events', icon: <IoCalendarOutline />, desc: 'Create and schedule events' },
    { label: 'New Milestone', href: '/admin/milestones', icon: <IoFlagOutline />, desc: 'Record temple achievements' },
    { label: 'Manage Tags', href: '/admin/tags', icon: <IoAddOutline />, desc: 'Organize event categories' },
    { label: 'Manage Users', href: '/admin/users', icon: <IoPeopleOutline />, desc: 'Admin user management' },
];

const s: Record<string, React.CSSProperties> = {
    page: { maxWidth: '1200px', margin: '0 auto' },
    header: { marginBottom: '2rem' },
    greeting: {
        fontFamily: "'Cinzel', serif",
        fontSize: 'clamp(1.5rem, 3vw, 2rem)',
        fontWeight: 700,
        color: '#1A1919',
        marginBottom: '0.25rem',
    },
    subtext: { fontSize: '0.95rem', color: '#343534', opacity: 0.6 },
    statsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1.25rem',
        marginBottom: '2.5rem',
    },
    statCard: {
        background: 'rgba(255,255,254,0.75)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(245,185,38,0.15)',
        borderRadius: '20px',
        padding: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        textDecoration: 'none',
        transition: 'all 0.3s ease',
    },
    statIcon: {
        width: '50px',
        height: '50px',
        borderRadius: '14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.4rem',
    },
    statValue: {
        fontFamily: "'Cinzel', serif",
        fontSize: '1.8rem',
        fontWeight: 700,
        color: '#1A1919',
        lineHeight: 1.1,
    },
    statLabel: { fontSize: '0.85rem', color: '#343534', opacity: 0.7 },
    sectionTitle: {
        fontFamily: "'Cinzel', serif",
        fontSize: '1.2rem',
        fontWeight: 600,
        color: '#1A1919',
        marginBottom: '1rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
    },
    actionsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '1rem',
    },
    actionCard: {
        background: 'rgba(255,255,254,0.7)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(245,185,38,0.12)',
        borderRadius: '16px',
        padding: '1.25rem',
        textDecoration: 'none',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        transition: 'all 0.3s ease',
        color: '#1A1919',
    },
    actionIcon: {
        width: '42px',
        height: '42px',
        borderRadius: '12px',
        background: 'linear-gradient(135deg, rgba(245,185,38,0.15), rgba(237,159,45,0.1))',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.2rem',
        color: '#F5B926',
        flexShrink: 0,
    },
    actionLabel: { fontWeight: 600, fontSize: '0.95rem', marginBottom: '0.15rem' },
    actionDesc: { fontSize: '0.8rem', color: '#343534', opacity: 0.6 },
    /* Storage widget */
    storageSection: {
        marginTop: '2.5rem',
        marginBottom: '2rem',
    },
    storageCard: {
        background: 'rgba(255,255,254,0.75)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(245,185,38,0.15)',
        borderRadius: '20px',
        padding: '1.5rem',
    },
    storageHeader: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1.25rem',
    },
    storagePlan: {
        fontSize: '0.75rem',
        fontWeight: 600,
        padding: '0.25rem 0.75rem',
        borderRadius: '12px',
        background: 'rgba(33,150,243,0.1)',
        color: '#1976D2',
        textTransform: 'uppercase' as const,
        letterSpacing: '0.04em',
    },
    storageGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1.25rem',
    },
    storageItem: {
        display: 'flex',
        flexDirection: 'column' as const,
        gap: '0.5rem',
    },
    storageItemHeader: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    storageItemLabel: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.4rem',
        fontSize: '0.85rem',
        fontWeight: 600,
        color: '#1A1919',
    },
    storageItemValue: {
        fontSize: '0.8rem',
        color: '#343534',
        opacity: 0.7,
    },
    progressTrack: {
        height: '8px',
        borderRadius: '4px',
        background: 'rgba(52,53,52,0.08)',
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: '4px',
        transition: 'width 1s ease',
    },
    storageUpdated: {
        marginTop: '1rem',
        fontSize: '0.72rem',
        color: 'rgba(52,53,52,0.4)',
        textAlign: 'right' as const,
    },
};

interface StorageData {
    storage: { used: number; limit: number; usedPercent: number };
    bandwidth: { used: number; limit: number; usedPercent: number };
    transformations: { used: number; limit: number; usedPercent: number };
    resources: { used: number; limit: number };
    derivedResources: { used: number; limit: number };
    plan: string;
    lastUpdated: string;
}

function formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function getProgressColor(percent: number): string {
    if (percent < 50) return '#4CAF50';
    if (percent < 75) return '#ED9F2D';
    if (percent < 90) return '#FF9800';
    return '#DF522A';
}

export default function AdminDashboard() {
    const { appUser, loading } = useAuth();
    const [dynamicStats, setDynamicStats] = useState(stats);
    const [storageData, setStorageData] = useState<StorageData | null>(null);
    const [storageLoading, setStorageLoading] = useState(true);

    useEffect(() => {
        async function fetchCounts() {
            try {
                const [events, milestones, subs] = await Promise.all([
                    getEvents(),
                    getMilestones(),
                    getSubscribers(),
                ]);
                setDynamicStats(prev => prev.map(s => {
                    if (s.label === 'Events') return { ...s, value: String(events.length) };
                    if (s.label === 'Milestones') return { ...s, value: String(milestones.length) };
                    if (s.label === 'Subscribers') return { ...s, value: String(subs.length) };
                    return s;
                }));
            } catch (err) {
                console.error('Failed to fetch dashboard stats:', err);
            }
        }
        fetchCounts();
    }, []);

    useEffect(() => {
        async function fetchStorage() {
            try {
                const res = await fetch('/api/admin/storage');
                if (res.ok) {
                    const data = await res.json();
                    setStorageData(data);
                }
            } catch (err) {
                console.error('Failed to fetch storage:', err);
            }
            setStorageLoading(false);
        }
        fetchStorage();
    }, []);

    if (loading) return <LoadingSpinner message="Loading dashboard..." />;

    return (
        <div style={s.page}>
            <motion.div style={s.header} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                <h1 style={s.greeting}>
                    <GiLotusFlower style={{ color: '#F5B926', fontSize: '0.8em' }} />{' '}
                    Welcome{appUser ? `, ${appUser.displayName}` : ''}
                </h1>
                <p style={s.subtext}>Manage the Sarasavi Viharaya temple website from here.</p>
            </motion.div>

            {/* Stats */}
            <div style={s.statsGrid}>
                {dynamicStats.map((stat, i) => (
                    <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                        <Link href={stat.href} style={s.statCard}>
                            <div style={{ ...s.statIcon, background: `${stat.color}18`, color: stat.color }}>
                                {stat.icon}
                            </div>
                            <div>
                                <div style={s.statValue}>{stat.value}</div>
                                <div style={s.statLabel}>{stat.label}</div>
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </div>

            {/* Quick Actions */}
            <h3 style={s.sectionTitle}>Quick Actions</h3>
            <div style={s.actionsGrid}>
                {quickActions.map((action, i) => (
                    <motion.div key={action.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.08 }}>
                        <Link href={action.href} style={s.actionCard}>
                            <div style={s.actionIcon}>{action.icon}</div>
                            <div>
                                <div style={s.actionLabel}>{action.label}</div>
                                <div style={s.actionDesc}>{action.desc}</div>
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </div>

            {/* Storage Usage */}
            <div style={s.storageSection}>
                <h3 style={s.sectionTitle}>
                    <IoCloudOutline /> Image Storage Usage
                </h3>
                {storageLoading ? (
                    <div style={{ ...s.storageCard, textAlign: 'center', padding: '2rem', color: 'rgba(52,53,52,0.5)' }}>
                        Loading storage info...
                    </div>
                ) : storageData ? (
                    <motion.div
                        style={s.storageCard}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        <div style={s.storageHeader}>
                            <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'rgba(52,53,52,0.6)' }}>Cloudinary</span>
                            <span style={s.storagePlan}>{storageData.plan} Plan</span>
                        </div>

                        <div style={s.storageGrid}>
                            {/* Storage */}
                            {(() => {
                                const pct = storageData.storage.limit > 0
                                    ? (storageData.storage.used / storageData.storage.limit) * 100
                                    : 0;
                                return (
                                    <div style={s.storageItem}>
                                        <div style={s.storageItemHeader}>
                                            <span style={s.storageItemLabel}><IoCloudOutline /> Storage</span>
                                            <span style={s.storageItemValue}>
                                                {formatBytes(storageData.storage.used)} / {formatBytes(storageData.storage.limit)}
                                            </span>
                                        </div>
                                        <div style={s.progressTrack}>
                                            <div style={{
                                                ...s.progressFill,
                                                width: `${Math.min(pct, 100)}%`,
                                                background: `linear-gradient(90deg, ${getProgressColor(pct)}, ${getProgressColor(pct)}cc)`,
                                            }} />
                                        </div>
                                        <span style={{ fontSize: '0.72rem', color: 'rgba(52,53,52,0.5)' }}>{pct.toFixed(1)}% used</span>
                                    </div>
                                );
                            })()}

                            {/* Bandwidth */}
                            {(() => {
                                const pct = storageData.bandwidth.limit > 0
                                    ? (storageData.bandwidth.used / storageData.bandwidth.limit) * 100
                                    : 0;
                                return (
                                    <div style={s.storageItem}>
                                        <div style={s.storageItemHeader}>
                                            <span style={s.storageItemLabel}><IoSwapHorizontalOutline /> Bandwidth</span>
                                            <span style={s.storageItemValue}>
                                                {formatBytes(storageData.bandwidth.used)} / {formatBytes(storageData.bandwidth.limit)}
                                            </span>
                                        </div>
                                        <div style={s.progressTrack}>
                                            <div style={{
                                                ...s.progressFill,
                                                width: `${Math.min(pct, 100)}%`,
                                                background: `linear-gradient(90deg, ${getProgressColor(pct)}, ${getProgressColor(pct)}cc)`,
                                            }} />
                                        </div>
                                        <span style={{ fontSize: '0.72rem', color: 'rgba(52,53,52,0.5)' }}>{pct.toFixed(1)}% used</span>
                                    </div>
                                );
                            })()}

                            {/* Transformations */}
                            {(() => {
                                const pct = storageData.transformations.limit > 0
                                    ? (storageData.transformations.used / storageData.transformations.limit) * 100
                                    : 0;
                                return (
                                    <div style={s.storageItem}>
                                        <div style={s.storageItemHeader}>
                                            <span style={s.storageItemLabel}><IoImagesOutline /> Transformations</span>
                                            <span style={s.storageItemValue}>
                                                {storageData.transformations.used.toLocaleString()} / {storageData.transformations.limit.toLocaleString()}
                                            </span>
                                        </div>
                                        <div style={s.progressTrack}>
                                            <div style={{
                                                ...s.progressFill,
                                                width: `${Math.min(pct, 100)}%`,
                                                background: `linear-gradient(90deg, ${getProgressColor(pct)}, ${getProgressColor(pct)}cc)`,
                                            }} />
                                        </div>
                                        <span style={{ fontSize: '0.72rem', color: 'rgba(52,53,52,0.5)' }}>{pct.toFixed(1)}% used</span>
                                    </div>
                                );
                            })()}

                            {/* Resources */}
                            {(() => {
                                const pct = storageData.resources.limit > 0
                                    ? (storageData.resources.used / storageData.resources.limit) * 100
                                    : 0;
                                return (
                                    <div style={s.storageItem}>
                                        <div style={s.storageItemHeader}>
                                            <span style={s.storageItemLabel}><IoImagesOutline /> Resources</span>
                                            <span style={s.storageItemValue}>
                                                {storageData.resources.used.toLocaleString()} / {storageData.resources.limit.toLocaleString()}
                                            </span>
                                        </div>
                                        <div style={s.progressTrack}>
                                            <div style={{
                                                ...s.progressFill,
                                                width: `${Math.min(pct, 100)}%`,
                                                background: `linear-gradient(90deg, ${getProgressColor(pct)}, ${getProgressColor(pct)}cc)`,
                                            }} />
                                        </div>
                                        <span style={{ fontSize: '0.72rem', color: 'rgba(52,53,52,0.5)' }}>{pct.toFixed(1)}% used</span>
                                    </div>
                                );
                            })()}
                        </div>

                        {storageData.lastUpdated && (
                            <div style={s.storageUpdated}>
                                Last updated: {new Date(storageData.lastUpdated).toLocaleString()}
                            </div>
                        )}
                    </motion.div>
                ) : (
                    <div style={{ ...s.storageCard, textAlign: 'center', padding: '2rem', color: 'rgba(52,53,52,0.5)' }}>
                        <IoCloudOutline style={{ fontSize: '2rem', marginBottom: '0.5rem', opacity: 0.3 }} />
                        <p style={{ fontSize: '0.9rem' }}>Unable to load storage data</p>
                    </div>
                )}
            </div>
        </div>
    );
}
