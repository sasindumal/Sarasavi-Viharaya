'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { IoHeartOutline, IoPersonOutline, IoConstructOutline, IoStarOutline } from 'react-icons/io5';
import { GiLotusFlower } from 'react-icons/gi';
import { getAcknowledgments } from '@/lib/firestore';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import FormattedText from '@/components/ui/FormattedText';
import type { Acknowledgment } from '@/types';
import styles from './page.module.css';

const CATEGORY_CONFIG = [
    { key: 'donor' as const, title: 'Gratitude to Donors', icon: <IoHeartOutline />, color: 'var(--sacred-gold)' },
    { key: 'workforce' as const, title: 'Gratitude to the Workforce', icon: <IoConstructOutline />, color: 'var(--saffron-amber)' },
    { key: 'special' as const, title: 'Special Mentions', icon: <IoStarOutline />, color: 'var(--vermillion-temple)' },
];

export default function AcknowledgmentsPage() {
    const [items, setItems] = useState<Acknowledgment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getAcknowledgments().then(data => { setItems(data); setLoading(false); }).catch(() => setLoading(false));
    }, []);

    if (loading) return <LoadingSpinner message="Loading acknowledgments..." />;

    return (
        <div className={styles.page}>
            <section className={styles.hero}>
                <motion.div className={styles.heroContent} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                    <GiLotusFlower className={styles.heroIcon} />
                    <h1>Punyanumodana</h1>
                    <p>Acknowledgments — With deepest gratitude to all who made this sacred journey possible</p>
                </motion.div>
            </section>

            <section className="section">
                <div className="container">
                    {CATEGORY_CONFIG.map((cat, ci) => {
                        const catItems = items.filter(a => a.category === cat.key);
                        if (catItems.length === 0) return null;
                        return (
                            <div key={ci} className={styles.category}>
                                <div className={styles.categoryHeader}>
                                    <span className={styles.categoryIcon} style={{ color: cat.color }}>{cat.icon}</span>
                                    <h2>{cat.title}</h2>
                                </div>
                                <div className={styles.ackGrid}>
                                    {catItems.map((item, i) => (
                                        <motion.div
                                            key={item.id}
                                            className={styles.ackCard}
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: i * 0.05 }}
                                        >
                                            <div className={styles.ackAvatar}>
                                                {item.photo ? (
                                                    // eslint-disable-next-line @next/next/no-img-element
                                                    <img src={item.photo} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                                                ) : (
                                                    <IoPersonOutline />
                                                )}
                                            </div>
                                            <h4>{item.name}</h4>
                                            <FormattedText text={item.description} />
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>
        </div>
    );
}
