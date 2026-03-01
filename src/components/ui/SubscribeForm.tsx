'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { IoMailOutline, IoCheckmarkCircle } from 'react-icons/io5';
import { GiLotusFlower } from 'react-icons/gi';

export default function SubscribeForm() {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [errorMsg, setErrorMsg] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setStatus('loading');
        try {
            const res = await fetch('/api/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, name }),
            });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Subscription failed');
            }
            setStatus('success');
            setEmail('');
            setName('');
        } catch (err) {
            setStatus('error');
            setErrorMsg(err instanceof Error ? err.message : 'Something went wrong');
        }
    };

    if (status === 'success') {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{
                    textAlign: 'center',
                    padding: '2rem',
                    background: 'var(--glass-bg)',
                    backdropFilter: 'blur(16px)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: 'var(--radius-xl)',
                }}
            >
                <IoCheckmarkCircle style={{ fontSize: '3rem', color: '#4CAF50', marginBottom: '0.75rem' }} />
                <h4 style={{ marginBottom: '0.5rem' }}>Thank You!</h4>
                <p style={{ fontSize: '0.95rem', opacity: 0.8 }}>You&apos;ll receive notifications about upcoming events and milestones.</p>
            </motion.div>
        );
    }

    return (
        <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{
                background: 'var(--glass-bg)',
                backdropFilter: 'blur(16px)',
                border: '1px solid var(--glass-border)',
                borderRadius: 'var(--radius-xl)',
                padding: '2rem',
            }}
        >
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <GiLotusFlower style={{ fontSize: '1.5rem', color: 'var(--sacred-gold)', marginBottom: '0.5rem' }} />
                <h3 style={{ fontSize: '1.15rem', marginBottom: '0.25rem' }}>Stay Connected</h3>
                <p style={{ fontSize: '0.9rem', opacity: 0.7 }}>Get notified about upcoming events and temple milestones</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <input
                    type="text"
                    className="input-field"
                    placeholder="Your name (optional)"
                    value={name}
                    onChange={e => setName(e.target.value)}
                />
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <div style={{ position: 'relative', flex: 1 }}>
                        <IoMailOutline style={{
                            position: 'absolute',
                            left: '0.75rem',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: 'var(--stone-charcoal)',
                            opacity: 0.4,
                        }} />
                        <input
                            type="email"
                            className="input-field"
                            placeholder="Your email address"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                            style={{ paddingLeft: '2.25rem' }}
                        />
                    </div>
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={status === 'loading'}
                        style={{ whiteSpace: 'nowrap' }}
                    >
                        {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
                    </button>
                </div>
            </div>
            {status === 'error' && (
                <p style={{ color: 'var(--vermillion-temple)', fontSize: '0.85rem', marginTop: '0.5rem' }}>{errorMsg}</p>
            )}
        </motion.form>
    );
}
