'use client';

import React, { useEffect, useState, useCallback } from 'react';
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
    IoMenuOutline,
    IoChevronBackOutline,
    IoCloseOutline,
} from 'react-icons/io5';
import { GiLotusFlower } from 'react-icons/gi';

const SIDEBAR_EXPANDED_WIDTH = 260;
const SIDEBAR_COLLAPSED_WIDTH = 68;
const MOBILE_BREAKPOINT = 768;

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

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { user, appUser, loading, logout } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [pwModalOpen, setPwModalOpen] = useState(false);
    const [currentPw, setCurrentPw] = useState('');
    const [newPw, setNewPw] = useState('');
    const [confirmPw, setConfirmPw] = useState('');
    const [pwSaving, setPwSaving] = useState(false);
    const [pwError, setPwError] = useState('');
    const [pwSuccess, setPwSuccess] = useState(false);

    // Detect mobile
    useEffect(() => {
        const checkMobile = () => {
            const mobile = window.innerWidth <= MOBILE_BREAKPOINT;
            setIsMobile(mobile);
            if (mobile) {
                setMobileMenuOpen(false);
            }
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Persist sidebar state in localStorage (desktop only)
    useEffect(() => {
        const saved = localStorage.getItem('admin-sidebar-open');
        if (saved !== null) {
            setSidebarOpen(saved === 'true');
        }
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        if (isMobile) {
            setMobileMenuOpen(false);
        }
    }, [pathname, isMobile]);

    const toggleSidebar = useCallback(() => {
        if (isMobile) {
            setMobileMenuOpen(prev => !prev);
        } else {
            const next = !sidebarOpen;
            setSidebarOpen(next);
            localStorage.setItem('admin-sidebar-open', String(next));
        }
    }, [isMobile, sidebarOpen]);

    const closeMobileMenu = useCallback(() => {
        setMobileMenuOpen(false);
    }, []);

    // On desktop: use expanded/collapsed width. On mobile: sidebar is overlay, no margin needed.
    const desktopSidebarWidth = sidebarOpen ? SIDEBAR_EXPANDED_WIDTH : SIDEBAR_COLLAPSED_WIDTH;
    // For sidebar render: on mobile always show expanded style (full labels) when open
    const showLabels = isMobile ? true : sidebarOpen;
    const currentSidebarWidth = isMobile ? SIDEBAR_EXPANDED_WIDTH : desktopSidebarWidth;

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

    // Determine if sidebar should be visible
    const sidebarVisible = isMobile ? mobileMenuOpen : true;

    return (
        <div style={{
            display: 'flex',
            minHeight: '100vh',
            marginTop: '-80px',
            paddingTop: '80px',
        }}>
            {/* Mobile: Floating hamburger button */}
            {isMobile && !mobileMenuOpen && (
                <button
                    onClick={toggleSidebar}
                    style={{
                        position: 'fixed',
                        top: '90px',
                        left: '10px',
                        zIndex: 60,
                        background: 'rgba(26, 25, 25, 0.95)',
                        backdropFilter: 'blur(10px)',
                        border: 'none',
                        color: '#F5B926',
                        cursor: 'pointer',
                        padding: '0.6rem',
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.35rem',
                        boxShadow: '0 2px 12px rgba(0,0,0,0.3)',
                    }}
                >
                    <IoMenuOutline />
                </button>
            )}

            {/* Mobile: Backdrop overlay */}
            {isMobile && mobileMenuOpen && (
                <div
                    onClick={closeMobileMenu}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(0,0,0,0.5)',
                        zIndex: 49,
                        transition: 'opacity 0.3s ease',
                    }}
                />
            )}

            {/* Sidebar */}
            <aside style={{
                width: `${currentSidebarWidth}px`,
                minWidth: `${currentSidebarWidth}px`,
                background: 'rgba(26, 25, 25, 0.95)',
                backdropFilter: 'blur(20px)',
                color: '#FFFFFE',
                display: 'flex',
                flexDirection: 'column',
                position: 'fixed',
                top: isMobile ? '0' : '80px',
                bottom: 0,
                left: isMobile
                    ? (mobileMenuOpen ? '0' : `-${currentSidebarWidth}px`)
                    : '0',
                zIndex: 50,
                overflowY: 'auto',
                overflowX: 'hidden',
                transition: isMobile
                    ? 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                    : 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1), min-width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            }}>
                {/* Sidebar Header */}
                <div style={{
                    padding: showLabels ? '1.5rem' : '1.5rem 0',
                    borderBottom: '1px solid rgba(255,255,254,0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: showLabels ? 'space-between' : 'center',
                    gap: '0.75rem',
                    minHeight: '72px',
                }}>
                    {showLabels && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', overflow: 'hidden' }}>
                            <GiLotusFlower style={{ fontSize: '1.5rem', color: '#F5B926', flexShrink: 0 }} />
                            <div style={{ whiteSpace: 'nowrap' }}>
                                <div style={{
                                    fontFamily: "'Cinzel', serif",
                                    fontSize: '0.95rem',
                                    fontWeight: 600,
                                    color: '#FFFFFE',
                                }}>Admin Panel</div>
                                <div style={{
                                    fontSize: '0.7rem',
                                    color: 'rgba(255,255,254,0.5)',
                                    textTransform: 'uppercase' as const,
                                    letterSpacing: '0.08em',
                                }}>Sarasavi Viharaya</div>
                            </div>
                        </div>
                    )}
                    <button
                        onClick={toggleSidebar}
                        title={isMobile ? 'Close menu' : (sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar')}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: 'rgba(255,255,254,0.6)',
                            cursor: 'pointer',
                            padding: '0.4rem',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.25rem',
                            transition: 'all 0.2s ease',
                            flexShrink: 0,
                        }}
                        onMouseEnter={e => {
                            (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,254,0.08)';
                            (e.currentTarget as HTMLButtonElement).style.color = '#F5B926';
                        }}
                        onMouseLeave={e => {
                            (e.currentTarget as HTMLButtonElement).style.background = 'none';
                            (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,254,0.6)';
                        }}
                    >
                        {isMobile ? <IoCloseOutline /> : (sidebarOpen ? <IoChevronBackOutline /> : <IoMenuOutline />)}
                    </button>
                </div>

                {/* User Info */}
                {appUser && (
                    <div style={{
                        padding: showLabels ? '0.75rem 1rem' : '0.75rem 0.5rem',
                        marginBottom: '0.5rem',
                        overflow: 'hidden',
                        textAlign: showLabels ? 'left' : 'center',
                    }}>
                        {showLabels ? (
                            <>
                                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#FFFFFE', whiteSpace: 'nowrap' }}>
                                    {appUser.displayName}
                                </div>
                                <span style={{
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
                                }}>{appUser.role.replace('_', ' ')}</span>
                            </>
                        ) : (
                            <div
                                title={appUser.displayName}
                                style={{
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '50%',
                                    background: 'linear-gradient(135deg, rgba(245,185,38,0.25), rgba(237,159,45,0.15))',
                                    color: '#F5B926',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '0.8rem',
                                    fontWeight: 700,
                                    margin: '0 auto',
                                }}
                            >
                                {appUser.displayName?.charAt(0)?.toUpperCase() || 'A'}
                            </div>
                        )}
                    </div>
                )}

                <nav style={{
                    flex: 1,
                    padding: showLabels ? '1rem 0.75rem' : '1rem 0.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                }}>
                    {navItems.map(item => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                title={!showLabels ? item.label : undefined}
                                onClick={isMobile ? closeMobileMenu : undefined}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: showLabels ? 'flex-start' : 'center',
                                    gap: '0.75rem',
                                    padding: showLabels ? '0.7rem 1rem' : '0.7rem 0',
                                    borderRadius: '10px',
                                    color: isActive ? '#F5B926' : 'rgba(255,255,254,0.65)',
                                    textDecoration: 'none',
                                    fontSize: showLabels ? '0.9rem' : '1.15rem',
                                    fontWeight: 500,
                                    transition: 'all 0.2s ease',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    ...(isActive ? {
                                        background: 'linear-gradient(135deg, rgba(245,185,38,0.15), rgba(237,159,45,0.1))',
                                    } : {}),
                                }}
                            >
                                <span style={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}>{item.icon}</span>
                                {showLabels && item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div style={{
                    padding: showLabels ? '1rem 0.75rem' : '1rem 0.5rem',
                    borderTop: '1px solid rgba(255,255,254,0.08)',
                }}>
                    <button
                        onClick={() => { resetPwForm(); setPwModalOpen(true); if (isMobile) closeMobileMenu(); }}
                        title={!showLabels ? 'Change Password' : undefined}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: showLabels ? 'flex-start' : 'center',
                            gap: '0.75rem',
                            padding: showLabels ? '0.7rem 1rem' : '0.7rem 0',
                            borderRadius: '10px',
                            color: 'rgba(255,255,254,0.65)',
                            textDecoration: 'none',
                            fontSize: showLabels ? '0.9rem' : '1.15rem',
                            fontWeight: 500,
                            transition: 'all 0.2s ease',
                            border: 'none',
                            background: 'none',
                            cursor: 'pointer',
                            width: '100%',
                            marginBottom: '4px',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                        }}
                    >
                        <span style={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}><IoLockClosedOutline /></span>
                        {showLabels && 'Change Password'}
                    </button>
                    <Link
                        href="/"
                        title={!showLabels ? 'View Site' : undefined}
                        onClick={isMobile ? closeMobileMenu : undefined}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: showLabels ? 'flex-start' : 'center',
                            gap: '0.75rem',
                            padding: showLabels ? '0.7rem 1rem' : '0.7rem 0',
                            borderRadius: '10px',
                            color: 'rgba(255,255,254,0.65)',
                            textDecoration: 'none',
                            fontSize: showLabels ? '0.9rem' : '1.15rem',
                            fontWeight: 500,
                            transition: 'all 0.2s ease',
                            marginBottom: '4px',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                        }}
                    >
                        <span style={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}><IoHomeOutline /></span>
                        {showLabels && 'View Site'}
                    </Link>
                    <button
                        onClick={() => { logout(); if (isMobile) closeMobileMenu(); }}
                        title={!showLabels ? 'Sign Out' : undefined}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: showLabels ? 'flex-start' : 'center',
                            gap: '0.75rem',
                            padding: showLabels ? '0.7rem 1rem' : '0.7rem 0',
                            borderRadius: '10px',
                            color: 'rgba(223,82,42,0.8)',
                            textDecoration: 'none',
                            fontSize: showLabels ? '0.9rem' : '1.15rem',
                            fontWeight: 500,
                            transition: 'all 0.2s ease',
                            border: 'none',
                            background: 'none',
                            cursor: 'pointer',
                            width: '100%',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                        }}
                    >
                        <span style={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}><IoLogOutOutline /></span>
                        {showLabels && 'Sign Out'}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main style={{
                flex: 1,
                marginLeft: isMobile ? '0' : `${desktopSidebarWidth}px`,
                padding: isMobile ? '1rem' : '2rem',
                paddingTop: isMobile ? '3.5rem' : '2rem',
                minHeight: 'calc(100vh - 80px)',
                transition: 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            }}>
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
