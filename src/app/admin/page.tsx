'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    IoCalendarOutline,
    IoFlagOutline,
    IoPeopleOutline,
    IoTrendingUpOutline,
    IoAddOutline,
} from 'react-icons/io5';
import { GiLotusFlower } from 'react-icons/gi';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
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
    { label: 'Subscribers', value: '0', icon: <IoPeopleOutline />, color: '#4CAF50', href: '#' },
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
};

export default function AdminDashboard() {
    const { appUser, loading } = useAuth();

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
                {stats.map((stat, i) => (
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
        </div>
    );
}
