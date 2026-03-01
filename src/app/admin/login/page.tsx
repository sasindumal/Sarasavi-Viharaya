'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { IoMailOutline, IoLockClosedOutline, IoLogInOutline } from 'react-icons/io5';
import { GiLotusFlower } from 'react-icons/gi';
import { signIn } from '@/lib/auth';

export default function AdminLoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await signIn(email, password);
            router.push('/admin');
        } catch (err) {
            if (err instanceof Error) {
                if (err.message.includes('wrong-password') || err.message.includes('invalid-credential')) {
                    setError('Invalid email or password.');
                } else if (err.message.includes('user-not-found')) {
                    setError('No account found with this email.');
                } else if (err.message.includes('too-many-requests')) {
                    setError('Too many attempts. Please try again later.');
                } else {
                    setError('Login failed. Please check your credentials.');
                }
            } else {
                setError('An unexpected error occurred.');
            }
        } finally {
            setLoading(false);
        }
    };

    const styles: Record<string, React.CSSProperties> = {
        page: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 'calc(100vh - 160px)',
            padding: '2rem',
        },
        card: {
            width: '100%',
            maxWidth: '420px',
            background: 'rgba(255,255,254,0.85)',
            backdropFilter: 'blur(30px)',
            border: '1px solid rgba(245,185,38,0.25)',
            borderRadius: '28px',
            boxShadow: '0 20px 60px rgba(26,25,25,0.12)',
            padding: '2.5rem',
        },
        header: {
            textAlign: 'center' as const,
            marginBottom: '2rem',
        },
        lotus: {
            fontSize: '2.5rem',
            color: '#F5B926',
            marginBottom: '0.75rem',
        },
        title: {
            fontFamily: "'Cinzel', serif",
            fontSize: '1.5rem',
            fontWeight: 700,
            color: '#1A1919',
            marginBottom: '0.25rem',
        },
        subtitle: {
            fontSize: '0.9rem',
            color: '#343534',
            opacity: 0.6,
        },
        inputGroup: {
            marginBottom: '1.25rem',
            position: 'relative' as const,
        },
        inputIcon: {
            position: 'absolute' as const,
            left: '1rem',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#343534',
            opacity: 0.4,
            fontSize: '1.1rem',
        },
        input: {
            width: '100%',
            padding: '0.85rem 1rem 0.85rem 2.75rem',
            border: '1.5px solid rgba(52,53,52,0.12)',
            borderRadius: '12px',
            fontSize: '0.95rem',
            background: 'rgba(255,255,254,0.8)',
            transition: 'all 0.15s ease',
            color: '#1A1919',
            outline: 'none',
        },
        error: {
            color: '#DF522A',
            fontSize: '0.85rem',
            textAlign: 'center' as const,
            marginBottom: '1rem',
            padding: '0.5rem',
            background: 'rgba(223,82,42,0.08)',
            borderRadius: '8px',
        },
        btn: {
            width: '100%',
            padding: '0.85rem',
            background: 'linear-gradient(135deg, #F5B926, #ED9F2D)',
            color: '#1A1919',
            border: 'none',
            borderRadius: '9999px',
            fontSize: '0.95rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            boxShadow: '0 4px 20px rgba(245,185,38,0.25)',
            transition: 'all 0.3s ease',
            letterSpacing: '0.03em',
            textTransform: 'uppercase' as const,
        },
    };

    return (
        <div style={styles.page}>
            <motion.div
                style={styles.card}
                initial={{ opacity: 0, y: 20, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                <div style={styles.header}>
                    <GiLotusFlower style={styles.lotus} />
                    <h1 style={styles.title}>Admin Login</h1>
                    <p style={styles.subtitle}>Sarasavi Viharaya Dashboard</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={styles.inputGroup}>
                        <IoMailOutline style={styles.inputIcon} />
                        <input
                            type="email"
                            placeholder="Email address"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                            style={styles.input}
                        />
                    </div>
                    <div style={styles.inputGroup}>
                        <IoLockClosedOutline style={styles.inputIcon} />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                            style={styles.input}
                        />
                    </div>

                    {error && <div style={styles.error}>{error}</div>}

                    <button
                        type="submit"
                        style={{ ...styles.btn, opacity: loading ? 0.7 : 1 }}
                        disabled={loading}
                    >
                        {loading ? 'Signing In...' : <><IoLogInOutline /> Sign In</>}
                    </button>
                </form>
            </motion.div>
        </div>
    );
}
