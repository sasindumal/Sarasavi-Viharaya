'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GiLotusFlower } from 'react-icons/gi';
import { IoPersonOutline } from 'react-icons/io5';
import { getBlessings } from '@/lib/firestore';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import FormattedText from '@/components/ui/FormattedText';
import type { BlessingMessage } from '@/types';
import styles from './page.module.css';

export default function BlessingsPage() {
    const [blessings, setBlessings] = useState<BlessingMessage[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getBlessings().then(data => { setBlessings(data); setLoading(false); }).catch(() => setLoading(false));
    }, []);

    if (loading) return <LoadingSpinner message="Loading blessings..." />;

    return (
        <div className={styles.page}>
            <section className={styles.hero}>
                <div className={styles.heroOverlay} />
                <motion.div
                    className={styles.heroContent}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <GiLotusFlower className={styles.heroIcon} />
                    <h1>Messages of Blessing & Greetings</h1>
                    <p>Heartfelt words from those who have guided and supported the Sarasavi Viharaya journey</p>
                </motion.div>
            </section>

            <section className="section">
                <div className="container">
                    <div className={styles.blessingsGrid}>
                        {blessings.map((blessing, i) => (
                            <motion.div
                                key={blessing.id}
                                className={styles.blessingCard}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <div className={styles.cardHeader}>
                                    <div className={styles.personPhoto}>
                                        {blessing.personPhoto ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img src={blessing.personPhoto} alt={blessing.personName} />
                                        ) : (
                                            <IoPersonOutline />
                                        )}
                                    </div>
                                    <div className={styles.personInfo}>
                                        <h3>{blessing.personName}</h3>
                                        <span className={styles.personTitle}>{blessing.personTitle}</span>
                                    </div>
                                </div>
                                <div className={styles.quoteDecor}>&ldquo;</div>
                                <FormattedText text={blessing.message} className={styles.message} />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
