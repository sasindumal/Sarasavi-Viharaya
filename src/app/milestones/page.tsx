'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { IoSearchOutline, IoCalendarOutline, IoTimeOutline, IoImagesOutline, IoArrowForward } from 'react-icons/io5';
import { GiLotusFlower, GiTempleGate } from 'react-icons/gi';
import CountdownTimer from '@/components/ui/CountdownTimer';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { getMilestones } from '@/lib/firestore';
import type { Milestone } from '@/types';
import styles from './page.module.css';

export default function MilestonesPage() {
    const [milestones, setMilestones] = useState<Milestone[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

    useEffect(() => {
        async function loadData() {
            try {
                const ms = await getMilestones();
                // Only show published milestones
                setMilestones(ms.filter(m => m.isPublished));
            } catch (err) {
                console.error('Error loading milestones:', err);
            }
            setLoading(false);
        }
        loadData();
    }, []);

    const filtered = useMemo(() => {
        let items = [...milestones];
        if (search) {
            items = items.filter(m => m.title.toLowerCase().includes(search.toLowerCase()) || m.description.toLowerCase().includes(search.toLowerCase()));
        }
        items.sort((a, b) => {
            const diff = new Date(a.date).getTime() - new Date(b.date).getTime();
            return sortOrder === 'desc' ? -diff : diff;
        });
        return items;
    }, [milestones, search, sortOrder]);

    const now = new Date();
    const upcoming = filtered.filter(m => new Date(m.date) >= now);
    const past = filtered.filter(m => new Date(m.date) < now);

    if (loading) return <LoadingSpinner message="Loading milestones..." />;

    return (
        <div className={styles.page}>
            <section className={styles.hero}>
                <motion.div className={styles.heroContent} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                    <GiTempleGate className={styles.heroIcon} />
                    <h1>Milestones</h1>
                    <p>A pictorial journey through the key achievements of Sarasavi Viharaya</p>
                </motion.div>
            </section>

            <section className="section">
                <div className="container container-sm">
                    {/* Controls */}
                    <div className={styles.controls}>
                        <div className={styles.searchBox}>
                            <IoSearchOutline />
                            <input type="text" placeholder="Search milestones..." value={search} onChange={(e) => setSearch(e.target.value)} />
                        </div>
                        <select className={styles.sortSelect} value={sortOrder} onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}>
                            <option value="desc">Newest First</option>
                            <option value="asc">Oldest First</option>
                        </select>
                    </div>

                    {/* Upcoming */}
                    {upcoming.length > 0 && (
                        <div className={styles.upcoming}>
                            <h2 className={styles.sectionLabel}>Upcoming</h2>
                            {upcoming.map((m, i) => (
                                <motion.div key={m.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                                    <Link href={`/milestones/${m.id}`} className={styles.upcomingCard}>
                                        <div className={styles.upcomingInfo}>
                                            <span className="badge badge-red">Upcoming</span>
                                            <h3>{m.title}</h3>
                                            <p>{m.description}</p>
                                            <CountdownTimer targetDate={m.date} compact />
                                        </div>
                                        <span className={styles.cardArrow}><IoArrowForward /></span>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    )}

                    {/* Timeline */}
                    <h2 className={styles.sectionLabel}>Timeline</h2>
                    <div className={styles.timeline}>
                        {past.map((m, i) => (
                            <motion.div key={m.id} className={styles.timelineItem} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.05 }}>
                                <div className={styles.timelineDot}>
                                    <GiLotusFlower />
                                </div>
                                <Link href={`/milestones/${m.id}`} className={styles.timelineCard}>
                                    {m.coverPhoto && (
                                        <div className={styles.timelineImage}>
                                            <img src={m.coverPhoto} alt={m.title} />
                                            {m.photos.length > 0 && <span className={styles.photoBadge}><IoImagesOutline /> {m.photos.length}</span>}
                                        </div>
                                    )}
                                    <div className={styles.timelineInfo}>
                                        <span className={styles.timelineDate}>
                                            <IoCalendarOutline /> {new Date(m.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                        </span>
                                        <h3>{m.title}</h3>
                                        <p>{m.description}</p>
                                        {m.duration && <span className={styles.duration}><IoTimeOutline /> {m.duration}</span>}
                                    </div>
                                    <span className={styles.cardArrow}><IoArrowForward /></span>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
