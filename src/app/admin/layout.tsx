'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { useAuth } from '@/lib/auth';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Modal from '@/components/ui/Modal';
import {
    IoGridOutline,
    IoCalendarOutline,
    IoFlagOutline,
    IoPricetagsOutline,
    IoPeopleOutline,
    IoMailOutline,
    IoLogOutOutline,
    IoHomeOutline,
    IoHeartOutline,
    IoRibbonOutline,
    IoLockClosedOutline,
    IoNotificationsOutline,
    IoNavigateOutline,
} from 'react-icons/io5';
import { GiLotusFlower } from 'react-icons/gi';

const navItems = [
    { href: '/admin', label: 'Dashboard', icon: <IoGridOutline /> },
    { href: '/admin/pages', label: 'Pages', icon: <IoNavigateOutline /> },
    { href: '/admin/events', label: 'Events', icon: <IoCalendarOutline /> },
    { href: '/admin/milestones', label: 'Milestones', icon: <IoFlagOutline /> },
    { href: '/admin/blessings', label: 'Blessings', icon: <IoHeartOutline /> },
    { href: '/admin/acknowledgments', label: 'Acknowledgments', icon: <IoRibbonOutline /> },
    { href: '/admin/messages', label: 'Messages', icon: <IoMailOutline /> },
    { href: '/admin/subscribers', label: 'Subscribers', icon: <IoNotificationsOutline /> },
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

    const [pwModalOpen, setPwModalOpen] = useState(false);
    const [currentPw, setCurrentPw] = useState('');
    const [newPw, setNewPw] = useState('');
    const [confirmPw, setConfirmPw] = useState('');
    const [pwSaving, setPwSaving] = useState(false);
    const [pwError, setPwError] = useState('');
    const [pwSuccess, setPwSuccess] = useState(false);

    const resetPwForm = () => {
        setCurrentPw(''); setNewPw(''); setConfirmPw('');
        setPwError(''); setPwSuccess(false);
    };

    const handleChangePassword = async () => {
        setPwError('');
        if (!newPw || !confirmPw || !currentPw) { setPwError('All fields are required.'); return; }
        if (newPw.length < 6) { setPwError('New password must be at least 6 characters.'); return; }
        if (newPw !== confirmPw) { setPwError('Passwords do not match.'); return; }
        if (!user?.email) { setPwError('No authenticated user found.'); return; }

        setPwSaving(true);
        try {
            const credential = EmailAuthProvider.credential(user.email, currentPw);
            await reauthenticateWithCredential(user, credential);
            await updatePassword(user, newPw);
            setPwSuccess(true);
            setCurrentPw(''); setNewPw(''); setConfirmPw('');
            setTimeout(() => { setPwModalOpen(false); setPwSuccess(false); }, 1500);
        } catch (err) {
            if (err instanceof Error) {
                if (err.message.includes('wrong-password') || err.message.includes('invalid-credential')) {
                    setPwError('Current password is incorrect.');
                } else if (err.message.includes('weak-password')) {
                    setPwError('New password is too weak. Use at least 6 characters.');
                } else if (err.message.includes('requires-recent-login')) {
                    setPwError('Session expired. Please sign out and sign in again.');
                } else {
                    setPwError(err.message);
                }
            }
        }
        setPwSaving(false);
    };

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
                    <button
                        onClick={() => { resetPwForm(); setPwModalOpen(true); }}
                        style={{
                            ...layoutStyles.navLink,
                            border: 'none',
                            background: 'none',
                            cursor: 'pointer',
                            width: '100%',
                            marginBottom: '4px',
                        }}
                    >
                        <IoLockClosedOutline /> Change Password
                    </button>
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

            {/* Change Password Modal */}
            <Modal isOpen={pwModalOpen} onClose={() => setPwModalOpen(false)} title="Change Password">
                {pwSuccess ? (
                    <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                        <IoLockClosedOutline style={{ fontSize: '2.5rem', color: '#4CAF50', marginBottom: '0.75rem' }} />
                        <p style={{ fontSize: '0.95rem', fontWeight: 600, color: '#343534' }}>Password updated successfully!</p>
                    </div>
                ) : (
                    <>
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#343534', marginBottom: '0.35rem' }}>Current Password *</label>
                            <input
                                type="password"
                                value={currentPw}
                                onChange={e => setCurrentPw(e.target.value)}
                                placeholder="Enter current password"
                                style={{ width: '100%', padding: '0.6rem 0.85rem', border: '1.5px solid rgba(52,53,52,0.12)', borderRadius: '10px', fontSize: '0.9rem', background: 'rgba(255,255,254,0.8)', outline: 'none' }}
                            />
                        </div>
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#343534', marginBottom: '0.35rem' }}>New Password *</label>
                            <input
                                type="password"
                                value={newPw}
                                onChange={e => setNewPw(e.target.value)}
                                placeholder="Min 6 characters"
                                style={{ width: '100%', padding: '0.6rem 0.85rem', border: '1.5px solid rgba(52,53,52,0.12)', borderRadius: '10px', fontSize: '0.9rem', background: 'rgba(255,255,254,0.8)', outline: 'none' }}
                            />
                        </div>
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#343534', marginBottom: '0.35rem' }}>Confirm New Password *</label>
                            <input
                                type="password"
                                value={confirmPw}
                                onChange={e => setConfirmPw(e.target.value)}
                                placeholder="Re-enter new password"
                                style={{ width: '100%', padding: '0.6rem 0.85rem', border: '1.5px solid rgba(52,53,52,0.12)', borderRadius: '10px', fontSize: '0.9rem', background: 'rgba(255,255,254,0.8)', outline: 'none' }}
                            />
                        </div>
                        {pwError && <p style={{ color: '#DF522A', fontSize: '0.85rem', marginBottom: '1rem' }}>{pwError}</p>}
                        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                            <button onClick={() => setPwModalOpen(false)} style={{ padding: '0.5rem 1.25rem', borderRadius: '10px', border: '1.5px solid rgba(52,53,52,0.12)', background: 'transparent', cursor: 'pointer' }}>Cancel</button>
                            <button onClick={handleChangePassword} disabled={pwSaving} style={{ padding: '0.5rem 1.25rem', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg, #F5B926, #ED9F2D)', color: '#1A1919', fontWeight: 600, cursor: 'pointer', opacity: pwSaving ? 0.6 : 1 }}>
                                {pwSaving ? 'Updating...' : 'Update Password'}
                            </button>
                        </div>
                    </>
                )}
            </Modal>
        </div>
    );
}
