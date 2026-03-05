'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { IoCalendarOutline, IoTimeOutline, IoArrowBack } from 'react-icons/io5';
import { GiLotusFlower, GiTempleGate } from 'react-icons/gi';
import CountdownTimer from '@/components/ui/CountdownTimer';
import PhotoAlbum from '@/components/ui/PhotoAlbum';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import FormattedText from '@/components/ui/FormattedText';
import { getMilestone } from '@/lib/firestore';
import type { Milestone } from '@/types';
import styles from './page.module.css';

export default function MilestoneDetailPage() {
    const params = useParams();
    const id = params.id as string;
    const [milestone, setMilestone] = useState<Milestone | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadMilestone() {
            try {
                const data = await getMilestone(id);
                setMilestone(data);
            } catch (err) {
                console.error('Error loading milestone:', err);
            }
            setLoading(false);
        }
        loadMilestone();
    }, [id]);

    if (loading) return <LoadingSpinner message="Loading milestone..." />;

    if (!milestone) {
        return (
            <div className={styles.notFound}>
                <GiTempleGate />
                <h2>Milestone Not Found</h2>
                <Link href="/milestones" className="btn btn-primary">Back to Milestones</Link>
            </div>
        );
    }

    const isPast = new Date(milestone.date) <= new Date();

    return (
        <div className={styles.page}>
            {/* Hero */}
            <section className={styles.hero}>
                {milestone.coverPhoto ? (
                    <img src={milestone.coverPhoto} alt={milestone.title} className={styles.heroBg} />
                ) : (
                    <div className={styles.heroBgPlaceholder}><GiLotusFlower /></div>
                )}
                <div className={styles.heroOverlay} />
                <motion.div className={styles.heroContent} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                    <Link href="/milestones" className={styles.backLink}><IoArrowBack /> Back to Milestones</Link>
                    <span className={`${styles.statusBadge} ${isPast ? styles.statusPast : styles.statusUpcoming}`}>
                        {isPast ? '✓ Completed' : '◎ Upcoming'}
                    </span>
                    <h1>{milestone.title}</h1>
                    <div className={styles.milestoneMeta}>
                        <span><IoCalendarOutline /> {new Date(milestone.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
                        <span><IoTimeOutline /> {milestone.duration}</span>
                    </div>
                </motion.div>
            </section>

            <section className="section">
                <div className="container container-sm">
                    {/* Countdown or Status */}
                    {!isPast && (
                        <motion.div className={styles.countdownSection} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                            <h3>Milestone Countdown</h3>
                            <CountdownTimer targetDate={milestone.date} />
                        </motion.div>
                    )}

                    {/* Description */}
                    <motion.div className={styles.descCard} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                        <h2>About This Milestone</h2>
                        <FormattedText text={milestone.description} />
                    </motion.div>

                    {/* Photo Album */}
                    {isPast && milestone.photos.length > 0 && (
                        <motion.div className={styles.albumSection} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                            <h2>Photo Album</h2>
                            <PhotoAlbum photos={milestone.photos} coverPhoto={milestone.coverPhoto} />
                        </motion.div>
                    )}
                </div>
            </section>
        </div>
    );
}
