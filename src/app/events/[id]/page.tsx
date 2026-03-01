'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { IoCalendarOutline, IoTimeOutline, IoArrowBack, IoNotificationsOutline } from 'react-icons/io5';
import { GiLotusFlower } from 'react-icons/gi';
import CountdownTimer from '@/components/ui/CountdownTimer';
import PhotoAlbum from '@/components/ui/PhotoAlbum';
import styles from './page.module.css';

// Demo data - in production fetched from Firestore
const demoEvents: Record<string, { title: string; description: string; date: string; duration: string; tags: string[]; coverPhoto: string; photos: string[]; }> = {
    '1': { title: 'Vesak Festival 2026', description: 'Annual Vesak celebration with lantern competition, Sil observance, Dansala, and Dharma sermons. Students and staff from all faculties participate in this grand festival, featuring Vesak lantern displays, drama competitions, and traditional food stalls. Buddhist nuns and monks conduct special Dharma sermons and meditation sessions throughout the festival.', date: '2026-05-12T06:00:00Z', duration: '2 days', tags: ['Vesak', 'Festival', 'Sil Observance'], coverPhoto: 'https://images.unsplash.com/photo-1590142035354-4612646a4394?w=1200&h=600&fit=crop', photos: [] },
    '2': { title: 'Poson Poya Celebration', description: 'Commemorating the arrival of Buddhism to Sri Lanka with special poojas and Dhamma programs. This event brings together the university Buddhist community for a day of reflection, worship, and cultural celebration.', date: '2026-06-10T06:00:00Z', duration: '1 day', tags: ['Poson', 'Poya'], coverPhoto: 'https://images.unsplash.com/photo-1544967082-d9d25d867d66?w=1200&h=600&fit=crop', photos: [] },
    '3': { title: 'Monthly Sil Observance — March', description: 'Full-day Sil program in the main preaching hall with meditation and Dhamma discussions. Participants observe the Eight Precepts, engage in walking and sitting meditation, and listen to Dharma talks by visiting monks.', date: '2026-03-14T06:00:00Z', duration: '1 day', tags: ['Sil Observance', 'Meditation'], coverPhoto: '', photos: [] },
    '4': { title: 'Pirith Chanting Ceremony', description: 'Overnight Pirith chanting organized by E22 batch, seeking blessings for the temple and university community. Monks from Mahamevnawa Monastery led the chanting, followed by an alms-giving ceremony the next morning.', date: '2025-12-31T18:00:00Z', duration: 'Overnight', tags: ['Pirith Chanting', 'Ceremony'], coverPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=600&fit=crop', photos: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop', 'https://images.unsplash.com/photo-1544967082-d9d25d867d66?w=600&h=400&fit=crop', 'https://images.unsplash.com/photo-1512036666432-2181c1f26f3b?w=600&h=400&fit=crop'] },
    '5': { title: 'Temple 7th Anniversary Celebration', description: 'Celebrating seven years since the founding of Sarasavi Viharaya with special ceremonies and community events. Milk rice offering, pooja, and Sathbudu Wandana were performed to mark this auspicious occasion.', date: '2025-09-24T06:00:00Z', duration: '1 day', tags: ['Anniversary', 'Celebration'], coverPhoto: 'https://images.unsplash.com/photo-1590142035354-4612646a4394?w=1200&h=600&fit=crop', photos: ['https://images.unsplash.com/photo-1590142035354-4612646a4394?w=600&h=400&fit=crop', 'https://images.unsplash.com/photo-1544967082-d9d25d867d66?w=600&h=400&fit=crop'] },
    '6': { title: 'Free Medical Camp', description: 'Community health camp providing free medical consultations and health checkups in the main preaching hall.', date: '2025-06-15T08:00:00Z', duration: '1 day', tags: ['Community Service', 'Medical Camp'], coverPhoto: '', photos: ['https://images.unsplash.com/photo-1512036666432-2181c1f26f3b?w=600&h=400&fit=crop'] },
};

export default function EventDetailPage() {
    const params = useParams();
    const id = params.id as string;
    const event = demoEvents[id];

    if (!event) {
        return (
            <div className={styles.notFound}>
                <GiLotusFlower />
                <h2>Event Not Found</h2>
                <Link href="/events" className="btn btn-primary">Back to Events</Link>
            </div>
        );
    }

    const isPast = new Date(event.date) <= new Date();

    return (
        <div className={styles.page}>
            {/* Hero */}
            <section className={styles.hero}>
                {event.coverPhoto ? (
                    <img src={event.coverPhoto} alt={event.title} className={styles.heroBg} />
                ) : (
                    <div className={styles.heroBgPlaceholder}><GiLotusFlower /></div>
                )}
                <div className={styles.heroOverlay} />
                <motion.div className={styles.heroContent} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                    <Link href="/events" className={styles.backLink}><IoArrowBack /> Back to Events</Link>
                    <div className={styles.eventTags}>
                        {event.tags.map(tag => <span key={tag} className="badge badge-gold">{tag}</span>)}
                    </div>
                    <h1>{event.title}</h1>
                    <div className={styles.eventMeta}>
                        <span><IoCalendarOutline /> {new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
                        <span><IoTimeOutline /> {event.duration}</span>
                    </div>
                </motion.div>
            </section>

            <section className="section">
                <div className="container container-sm">
                    {/* Countdown or Status */}
                    {!isPast && (
                        <motion.div className={styles.countdownSection} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                            <h3>Event Starts In</h3>
                            <CountdownTimer targetDate={event.date} />
                        </motion.div>
                    )}

                    {/* Description */}
                    <motion.div className={styles.descCard} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                        <h2>About This Event</h2>
                        <p>{event.description}</p>
                    </motion.div>

                    {/* Photo Album */}
                    {isPast && event.photos.length > 0 && (
                        <motion.div className={styles.albumSection} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                            <h2>Photo Album</h2>
                            <PhotoAlbum photos={event.photos} coverPhoto={event.coverPhoto} />
                        </motion.div>
                    )}
                </div>
            </section>
        </div>
    );
}
