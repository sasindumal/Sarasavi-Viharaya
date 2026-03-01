'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { IoCalendarOutline, IoTimeOutline, IoArrowBack } from 'react-icons/io5';
import { GiLotusFlower, GiTempleGate } from 'react-icons/gi';
import CountdownTimer from '@/components/ui/CountdownTimer';
import PhotoAlbum from '@/components/ui/PhotoAlbum';
import styles from './page.module.css';

// Demo data - in production fetched from Firestore
const demoMilestones: Record<string, { title: string; description: string; date: string; duration: string; coverPhoto: string; photos: string[]; }> = {
    '1': { title: 'Buddhist Brotherhood Society Registered', description: 'On the 24th of September 2018, a group of visionary undergraduates formally registered the Buddhist Brotherhood Society at the University of Jaffna. This marked the beginning of an extraordinary journey — building a permanent Buddhist temple on a predominantly non-Buddhist campus, driven purely by student dedication and spiritual commitment. The initial registration overcame bureaucratic hurdles and skepticism, requiring signatures from multiple faculty student bodies to proceed.', date: '2018-09-24T06:00:00Z', duration: '1 day', coverPhoto: '', photos: [] },
    '2': { title: 'First Land Clearing', description: 'The founding students identified a neglected plot of university land — a dense jungle area filled with overgrown vegetation and debris. With nothing more than machetes, hoes, and their bare hands, they cleared the land over multiple weekends. This physical labor became a spiritual exercise in determination and community building, attracting more students to the cause.', date: '2019-01-15T06:00:00Z', duration: '3 months', coverPhoto: '', photos: [] },
    '3': { title: 'Relic Palace Opened', description: 'Completed within seven days primarily through student labor, the Relic Palace was officially opened. This small but sacred structure was the first permanent building on the temple grounds, housing sacred relics and serving as a focal point for daily worship.', date: '2019-03-02T06:00:00Z', duration: '1 day', coverPhoto: '', photos: [] },
    '4': { title: 'Main Hall Roof Completed', description: 'With Dr. Bandula Abeysundara\'s support, the roofing of the 5,000 sq.ft. main preaching hall was completed. This was a major construction milestone, as the hall serves as the primary space for Dharma sermons, Sil programs, meditation retreats, and community gatherings. The massive scale of this project required significant fundraising and coordination.', date: '2022-03-26T06:00:00Z', duration: '1 day', coverPhoto: '', photos: [] },
    '5': { title: 'Stupa Pinnacle Enshrined', description: 'The crowning moment of the stupa construction — the golden pinnacle (Kotha) was ceremonially placed atop the 10-meter stupa modeled after the ancient Ruwanweliseya. Monks from Mahamevnawa Monastery presided over the ceremony, with hundreds of students and community members participating in this historic event.', date: '2023-06-15T06:00:00Z', duration: '1 day', coverPhoto: 'https://images.unsplash.com/photo-1544967082-d9d25d867d66?w=1200&h=600&fit=crop', photos: ['https://images.unsplash.com/photo-1544967082-d9d25d867d66?w=600&h=400&fit=crop', 'https://images.unsplash.com/photo-1590142035354-4612646a4394?w=600&h=400&fit=crop'] },
    '6': { title: 'Stupa Foundation Laid', description: 'Base stone for the 10-meter stupa was laid, modeled after Ruwanweliseya with guidance from Mahamevnawa Monastery.', date: '2019-07-06T06:00:00Z', duration: '1 day', coverPhoto: '', photos: [] },
    '7': { title: 'Bo Tree Planted', description: 'A sacred Bo tree sapling, believed to be linked to the Sri Maha Bodhi in Anuradhapura, was planted near the stupa. This living symbol of enlightenment now provides shade and serenity for meditation practitioners.', date: '2020-02-04T06:00:00Z', duration: '1 day', coverPhoto: '', photos: [] },
    '8': { title: 'First Katina Ceremony', description: 'The first-ever Katina robe offering ceremony at Sarasavi Viharaya, marking the temple\'s recognition as a formal place of worship by the monastic community. Monks from several monasteries were invited to participate.', date: '2020-10-12T06:00:00Z', duration: '1 day', coverPhoto: '', photos: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop'] },
    '13': { title: 'Upcoming: Bodhi Puja Festival', description: 'Grand Bodhi Puja with special chanting ceremonies and offerings. This event will bring together the entire university Buddhist community for a day of devotion and celebration around the sacred Bo tree.', date: '2026-04-15T06:00:00Z', duration: '1 day', coverPhoto: '', photos: [] },
};

export default function MilestoneDetailPage() {
    const params = useParams();
    const id = params.id as string;
    const milestone = demoMilestones[id];

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
                        <p>{milestone.description}</p>
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
