'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { IoLogoYoutube, IoLogoFacebook, IoMail, IoCall, IoLocationOutline, IoSend } from 'react-icons/io5';
import styles from './page.module.css';

const contactMethods = [
    { icon: <IoLogoYoutube />, label: 'YouTube', value: 'Thal Arane Damsak Nada', href: 'https://youtube.com', color: '#FF0000' },
    { icon: <IoLogoFacebook />, label: 'Facebook', value: 'Sarasavi Viharaya', href: 'https://facebook.com', color: '#1877F2' },
    { icon: <IoMail />, label: 'Email', value: 'sarasaviviharaya@gmail.com', href: 'mailto:sarasaviviharaya@gmail.com', color: 'var(--sacred-gold-dark)' },
    { icon: <IoCall />, label: 'Mobile', value: '+94 77 123 4567', href: 'tel:+94771234567', color: 'var(--sacred-gold)' },
];

export default function ContactPage() {
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
                        </div>

                        {/* Contact Form */}
                        <motion.div className={styles.formCard} initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                            <h2>Send a Message</h2>
                            <form onSubmit={(e) => e.preventDefault()}>
                                <div className="form-group">
                                    <label htmlFor="name">Your Name</label>
                                    <input id="name" type="text" className="input-field" placeholder="Enter your name" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="email">Email Address</label>
                                    <input id="email" type="email" className="input-field" placeholder="Enter your email" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="subject">Subject</label>
                                    <input id="subject" type="text" className="input-field" placeholder="What is this about?" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="message">Message</label>
                                    <textarea id="message" className="input-field" placeholder="Your message..." rows={5}></textarea>
                                </div>
                                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                                    <IoSend /> Send Message
                                </button>
                            </form>
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    );
}
