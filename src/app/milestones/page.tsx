'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { IoSearchOutline, IoCalendarOutline, IoTimeOutline, IoImagesOutline, IoArrowForward } from 'react-icons/io5';
import { GiLotusFlower, GiTempleGate } from 'react-icons/gi';
import CountdownTimer from '@/components/ui/CountdownTimer';
import styles from './page.module.css';

const demoMilestones = [
    { id: '1', title: 'Main Hall Grand Opening', description: 'After 3.5 years of dedicated construction, the 5,000 sq.ft. main preaching hall was officially opened.', date: '2024-02-10T06:00:00Z', duration: '1 day', coverPhoto: 'https://images.unsplash.com/photo-1590142035354-4612646a4394?w=800&h=500&fit=crop', photos: ['https://images.unsplash.com/photo-1590142035354-4612646a4394?w=400&h=300&fit=crop', 'https://images.unsplash.com/photo-1544967082-d9d25d867d66?w=400&h=300&fit=crop'] },
    { id: '2', title: '5th Anniversary Celebration', description: 'Temple\'s 5th anniversary with opening of Bodhi Prakaraya, Saman Devalaya, Dolosmahe Pahana, and kitchen.', date: '2023-08-24T06:00:00Z', duration: '1 day', coverPhoto: 'https://images.unsplash.com/photo-1544967082-d9d25d867d66?w=800&h=500&fit=crop', photos: ['https://images.unsplash.com/photo-1544967082-d9d25d867d66?w=400&h=300&fit=crop'] },
    { id: '3', title: 'Buddha Statue Unveiled', description: '8-foot-tall Buddha statue in "Ashirwada Mudra" pose unveiled on Vesak Poya day 2023.', date: '2023-05-05T06:00:00Z', duration: '2 days', coverPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=500&fit=crop', photos: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop'] },
    { id: '4', title: 'Main Hall Roof Completed', description: 'With Dr. Bandula Abeysundara\'s support, the roofing of the 5,000 sq.ft. hall was completed.', date: '2022-03-26T06:00:00Z', duration: '1 day', coverPhoto: '', photos: [] },
    { id: '5', title: 'Main Hall Floor Concreted', description: 'E20 batch concreted the entire 5,000 sq.ft. floor, mixing approximately 187 cement bags over five days.', date: '2022-05-10T06:00:00Z', duration: '5 days', coverPhoto: '', photos: [] },
    { id: '6', title: 'Stupa Pinnacle Unveiled', description: 'Most Ven. Kiribathgoda Gananananda Thero presided over the pinnacle unveiling ceremony, broadcast on Shraddha TV.', date: '2020-03-07T06:00:00Z', duration: '1 day', coverPhoto: 'https://images.unsplash.com/photo-1512036666432-2181c1f26f3b?w=800&h=500&fit=crop', photos: ['https://images.unsplash.com/photo-1512036666432-2181c1f26f3b?w=400&h=300&fit=crop'] },
    { id: '7', title: 'Sacred Relic Deposit Ceremony', description: 'Relics of Lord Buddha and Arahant Maha Theros deposited inside the stupa. Copper plates with Suttas placed inside.', date: '2019-11-09T06:00:00Z', duration: '2 days', coverPhoto: '', photos: [] },
    { id: '8', title: 'Stupa Foundation Laid', description: 'Base stone for the 10-meter stupa was laid, modeled after Ruwanweliseya with guidance from Mahamevnawa Monastery.', date: '2019-07-06T06:00:00Z', duration: '1 day', coverPhoto: '', photos: [] },
    { id: '9', title: 'Relic Palace Opened', description: 'Completed within seven days primarily through student labor, the Relic Palace was officially opened.', date: '2019-03-02T06:00:00Z', duration: '1 day', coverPhoto: '', photos: [] },
    { id: '10', title: 'Foundation Stone Laid', description: 'Professor Ratnam Vigneshwaran, Vice Chancellor, participated in the foundation stone-laying ceremony.', date: '2018-12-14T06:00:00Z', duration: '1 day', coverPhoto: '', photos: [] },
    { id: '11', title: 'Temple Founded — Bodhi Tree Planted', description: 'The sacred Jaya Sri Maha Bodhi tree was planted, and the temple was named "Sarasavi Viharaya."', date: '2018-09-24T06:00:00Z', duration: '2 days', coverPhoto: '', photos: [] },
    { id: '12', title: 'Buddhist Society Registered', description: 'First AGM held on March 3, 2018. Buddhist Society officially registered under the University of Jaffna.', date: '2018-03-03T06:00:00Z', duration: '1 day', coverPhoto: '', photos: [] },
    { id: '13', title: 'Upcoming: Bodhi Puja Festival', description: 'Grand Bodhi Puja with special chanting ceremonies and offerings.', date: '2026-04-15T06:00:00Z', duration: '1 day', coverPhoto: '', photos: [] },
];

export default function MilestonesPage() {
    const [search, setSearch] = useState('');
    const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
    const now = new Date();

    const filtered = useMemo(() => {
        let items = [...demoMilestones];
        if (search) {
            items = items.filter(m => m.title.toLowerCase().includes(search.toLowerCase()) || m.description.toLowerCase().includes(search.toLowerCase()));
        }
        items.sort((a, b) => {
            const diff = new Date(a.date).getTime() - new Date(b.date).getTime();
            return sortOrder === 'desc' ? -diff : diff;
        });
        return items;
    }, [search, sortOrder]);

    const upcoming = filtered.filter(m => new Date(m.date) > now);
    const past = filtered.filter(m => new Date(m.date) <= now);

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
