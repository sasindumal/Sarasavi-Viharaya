'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { IoCalendarOutline, IoTimeOutline, IoArrowBack, IoNotificationsOutline } from 'react-icons/io5';
import { GiLotusFlower } from 'react-icons/gi';
import CountdownTimer from '@/components/ui/CountdownTimer';
import PhotoAlbum from '@/components/ui/PhotoAlbum';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import FormattedText from '@/components/ui/FormattedText';
import { getEvent } from '@/lib/firestore';
import type { Event } from '@/types';
import styles from './page.module.css';

export default function EventDetailPage() {
    const params = useParams();
    const id = params.id as string;
    const [event, setEvent] = useState<Event | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadEvent() {
            try {
                const data = await getEvent(id);
                setEvent(data);
            } catch (err) {
                console.error('Error loading event:', err);
            }
            setLoading(false);
        }
        loadEvent();
    }, [id]);

    if (loading) return <LoadingSpinner message="Loading event..." />;

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
                        <FormattedText text={event.description} />
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
