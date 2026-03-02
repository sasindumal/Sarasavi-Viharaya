'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { IoLogoYoutube, IoLogoFacebook, IoMail, IoCall, IoLocationOutline, IoSend, IoCheckmarkCircleOutline, IoQrCodeOutline } from 'react-icons/io5';
import styles from './page.module.css';

const contactMethods = [
    { icon: <IoLogoYoutube />, label: 'YouTube', value: 'Thal Arane Damsak Nada', href: 'https://www.youtube.com/@thalaranedamsaknada4502', color: '#FF0000' },
    { icon: <IoLogoFacebook />, label: 'Facebook', value: 'Jaffna Uni YMBA', href: 'https://web.facebook.com/JaffnaUniYMBA', color: '#1877F2' },
    { icon: <IoMail />, label: 'Email', value: 'thalaranedamsaknada@gmail.com', href: 'mailto:thalaranedamsaknada@gmail.com', color: 'var(--sacred-gold-dark)' },
    { icon: <IoCall />, label: 'Mobile', value: '+94 77 699 3908 (Saliya Sampath)', href: 'tel:+94776993908', color: 'var(--sacred-gold)' },
];

export default function ContactPage() {
    const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState('');

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!form.name || !form.email || !form.subject || !form.message) {
            setError('Please fill in all fields.');
            return;
        }
        setError('');
        setSending(true);
        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to send message');
            }
            setSent(true);
            setForm({ name: '', email: '', subject: '', message: '' });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
        }
        setSending(false);
    }

    return (
        <div className={styles.page}>
            <section className={styles.hero}>
                <motion.div className={styles.heroContent} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                    <IoCall className={styles.heroIcon} />
                    <h1>Contact Us</h1>
                    <p>We&apos;d love to hear from you. Reach out through any channel below.</p>
                </motion.div>
            </section>

            <section className="section">
                <div className="container">
                    <div className={styles.grid}>
                        {/* Contact Methods */}
                        <div className={styles.methods}>
                            <h2>Get in Touch</h2>
                            <div className={styles.methodCards}>
                                {contactMethods.map((m, i) => (
                                    <motion.a
                                        key={i}
                                        href={m.href}
                                        target={m.href.startsWith('http') ? '_blank' : undefined}
                                        rel="noopener noreferrer"
                                        className={styles.methodCard}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.1 }}
                                    >
                                        <span className={styles.methodIcon} style={{ color: m.color }}>{m.icon}</span>
                                        <div>
                                            <h4>{m.label}</h4>
                                            <span>{m.value}</span>
                                        </div>
                                    </motion.a>
                                ))}
                            </div>

                            <div className={styles.location}>
                                <IoLocationOutline className={styles.locIcon} />
                                <div>
                                    <h4>Location</h4>
                                    <p>Sarasavi Viharaya, Kilinochchi Premises, University of Jaffna, Kilinochchi, Sri Lanka</p>
                                </div>
                            </div>

                            {/* QR Codes */}
                            <div className={styles.qrSection}>
                                <h3 className={styles.qrTitle}>
                                    <IoQrCodeOutline /> Scan to Follow Us
                                </h3>
                                <div className={styles.qrCards}>
                                    <motion.a
                                        href="https://www.youtube.com/@thalaranedamsaknada4502"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={styles.qrCard}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.1 }}
                                    >
                                        <div className={styles.qrImageWrap} style={{ borderColor: 'rgba(255,0,0,0.2)' }}>
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent('https://www.youtube.com/@thalaranedamsaknada4502')}&bgcolor=FFFFFE&color=1A1919&margin=8`}
                                                alt="YouTube QR Code"
                                                width={160}
                                                height={160}
                                                className={styles.qrImage}
                                            />
                                        </div>
                                        <div className={styles.qrLabel}>
                                            <IoLogoYoutube style={{ color: '#FF0000', fontSize: '1.2rem' }} />
                                            <span>YouTube</span>
                                        </div>
                                    </motion.a>

                                    <motion.a
                                        href="https://web.facebook.com/JaffnaUniYMBA"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={styles.qrCard}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.2 }}
                                    >
                                        <div className={styles.qrImageWrap} style={{ borderColor: 'rgba(24,119,242,0.2)' }}>
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent('https://web.facebook.com/JaffnaUniYMBA')}&bgcolor=FFFFFE&color=1A1919&margin=8`}
                                                alt="Facebook QR Code"
                                                width={160}
                                                height={160}
                                                className={styles.qrImage}
                                            />
                                        </div>
                                        <div className={styles.qrLabel}>
                                            <IoLogoFacebook style={{ color: '#1877F2', fontSize: '1.2rem' }} />
                                            <span>Facebook</span>
                                        </div>
                                    </motion.a>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <motion.div className={styles.formCard} initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                            <h2>Send a Message</h2>
                            {sent ? (
                                <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                                    <IoCheckmarkCircleOutline style={{ fontSize: '3rem', color: 'var(--sacred-gold)' }} />
                                    <h3 style={{ margin: '1rem 0 0.5rem' }}>Message Sent!</h3>
                                    <p style={{ color: '#666' }}>Thank you for reaching out. We&apos;ll get back to you soon.</p>
                                    <button className="btn btn-secondary" style={{ marginTop: '1rem' }} onClick={() => setSent(false)}>
                                        Send Another Message
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit}>
                                    <div className="form-group">
                                        <label htmlFor="name">Your Name</label>
                                        <input id="name" type="text" className="input-field" placeholder="Enter your name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="email">Email Address</label>
                                        <input id="email" type="email" className="input-field" placeholder="Enter your email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="subject">Subject</label>
                                        <input id="subject" type="text" className="input-field" placeholder="What is this about?" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="message">Message</label>
                                        <textarea id="message" className="input-field" placeholder="Your message..." rows={5} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}></textarea>
                                    </div>
                                    {error && (
                                        <p style={{ color: '#e74c3c', fontSize: '0.9rem', margin: '0 0 1rem' }}>{error}</p>
                                    )}
                                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={sending}>
                                        {sending ? 'Sending...' : <><IoSend /> Send Message</>}
                                    </button>
                                </form>
                            )}
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    );
}
