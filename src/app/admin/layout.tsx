'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import {
    IoGridOutline,
    IoCalendarOutline,
    IoFlagOutline,
    IoPricetagsOutline,
    IoPeopleOutline,
    IoMailOutline,
    IoLogOutOutline,
    IoHomeOutline,
} from 'react-icons/io5';
import { GiLotusFlower } from 'react-icons/gi';

const navItems = [
    { href: '/admin', label: 'Dashboard', icon: <IoGridOutline /> },
    { href: '/admin/events', label: 'Events', icon: <IoCalendarOutline /> },
    { href: '/admin/milestones', label: 'Milestones', icon: <IoFlagOutline /> },
    { href: '/admin/messages', label: 'Messages', icon: <IoMailOutline /> },
    { href: '/admin/tags', label: 'Tags', icon: <IoPricetagsOutline /> },
    { href: '/admin/users', label: 'Users', icon: <IoPeopleOutline /> },
];

const layoutStyles: Record<string, React.CSSProperties> = {
    wrapper: {
        display: 'flex',
        minHeight: '100vh',
        marginTop: '-80px',
        paddingTop: '80px',
    },
    sidebar: {
        width: '260px',
        background: 'rgba(26, 25, 25, 0.95)',
        backdropFilter: 'blur(20px)',
        color: '#FFFFFE',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: '80px',
        bottom: 0,
        left: 0,
        zIndex: 50,
        overflowY: 'auto',
    },
    sidebarHeader: {
        padding: '1.5rem',
        borderBottom: '1px solid rgba(255,255,254,0.08)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
    },
    logo: {
        fontSize: '1.5rem',
        color: '#F5B926',
    },
    title: {
        fontFamily: "'Cinzel', serif",
        fontSize: '0.95rem',
        fontWeight: 600,
        color: '#FFFFFE',
    },
    subtitle: {
        fontSize: '0.7rem',
        color: 'rgba(255,255,254,0.5)',
        textTransform: 'uppercase' as const,
        letterSpacing: '0.08em',
    },
    nav: {
        flex: 1,
        padding: '1rem 0.75rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
    },
    navLink: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '0.7rem 1rem',
        borderRadius: '10px',
        color: 'rgba(255,255,254,0.65)',
        textDecoration: 'none',
        fontSize: '0.9rem',
        fontWeight: 500,
        transition: 'all 0.2s ease',
    },
    navLinkActive: {
        background: 'linear-gradient(135deg, rgba(245,185,38,0.15), rgba(237,159,45,0.1))',
        color: '#F5B926',
    },
    footer: {
        padding: '1rem 0.75rem',
        borderTop: '1px solid rgba(255,255,254,0.08)',
    },
    content: {
        flex: 1,
        marginLeft: '260px',
        padding: '2rem',
        minHeight: 'calc(100vh - 80px)',
    },
    roleTag: {
        display: 'inline-block',
        padding: '0.15rem 0.5rem',
        borderRadius: '9999px',
        fontSize: '0.65rem',
        fontWeight: 600,
        textTransform: 'uppercase' as const,
        letterSpacing: '0.05em',
        background: 'rgba(245,185,38,0.15)',
        color: '#F5B926',
        marginTop: '0.25rem',
    },
    userInfo: {
        padding: '0.75rem 1rem',
        marginBottom: '0.5rem',
    },
    userName: {
        fontSize: '0.85rem',
        fontWeight: 600,
        color: '#FFFFFE',
    },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { user, appUser, loading, logout } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    // Login page renders without sidebar/auth guard
    const isLoginPage = pathname === '/admin/login';

    useEffect(() => {
        if (!loading && !user && !isLoginPage) {
            router.push('/admin/login');
        }
    }, [loading, user, router, isLoginPage]);

    // Login page — just render children directly
    if (isLoginPage) {
        return <>{children}</>;
    }

    if (loading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
                <LoadingSpinner message="Checking authentication..." />
            </div>
        );
    }

    if (!user) return null;

    return (
        <div style={layoutStyles.wrapper}>
            {/* Sidebar */}
            <aside style={layoutStyles.sidebar}>
                <div style={layoutStyles.sidebarHeader}>
                    <GiLotusFlower style={layoutStyles.logo} />
                    <div>
                        <div style={layoutStyles.title}>Admin Panel</div>
                        <div style={layoutStyles.subtitle}>Sarasavi Viharaya</div>
                    </div>
                </div>

                {/* User Info */}
                {appUser && (
                    <div style={layoutStyles.userInfo}>
                        <div style={layoutStyles.userName}>{appUser.displayName}</div>
                        <span style={layoutStyles.roleTag}>{appUser.role.replace('_', ' ')}</span>
                    </div>
                )}

                <nav style={layoutStyles.nav}>
                    {navItems.map(item => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                style={{
                                    ...layoutStyles.navLink,
                                    ...(isActive ? layoutStyles.navLinkActive : {}),
                                }}
                            >
                                {item.icon}
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div style={layoutStyles.footer}>
                    <Link href="/" style={{ ...layoutStyles.navLink, marginBottom: '4px' }}>
                        <IoHomeOutline /> View Site
                    </Link>
                    <button
                        onClick={logout}
                        style={{
                            ...layoutStyles.navLink,
                            border: 'none',
                            background: 'none',
                            cursor: 'pointer',
                            width: '100%',
                            color: 'rgba(223,82,42,0.8)',
                        }}
                    >
                        <IoLogOutOutline /> Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main style={layoutStyles.content}>
                {children}
            </main>
        </div>
    );
}
