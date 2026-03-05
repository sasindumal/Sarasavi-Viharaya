'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { IoCalendarOutline, IoTimeOutline, IoSearchOutline, IoFilterOutline, IoImagesOutline, IoArrowForward } from 'react-icons/io5';
import { GiLotusFlower } from 'react-icons/gi';
import CountdownTimer from '@/components/ui/CountdownTimer';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import FormattedText from '@/components/ui/FormattedText';
import { getEvents, getTags } from '@/lib/firestore';
import type { Event, Tag } from '@/types';
import styles from './page.module.css';

export default function EventsPage() {
    const [events, setEvents] = useState<Event[]>([]);
    const [allTags, setAllTags] = useState<string[]>(['All']);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState<'upcoming' | 'past'>('upcoming');
    const [search, setSearch] = useState('');
    const [selectedTag, setSelectedTag] = useState('All');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

    useEffect(() => {
        async function loadData() {
            try {
                const [evts, tags] = await Promise.all([getEvents(), getTags()]);
                const published = evts.filter(e => e.isPublished);
                setEvents(published);
                setAllTags(['All', ...tags.map(t => t.name)]);

                // Auto-switch to past tab if no upcoming events
                const now = new Date();
                const hasUpcoming = published.some(e => new Date(e.date) >= now);
                if (!hasUpcoming && published.length > 0) {
                    setTab('past');
                }
            } catch (err) {
                console.error('Error loading events:', err);
            }
            setLoading(false);
        }
        loadData();
    }, []);

    const filteredEvents = useMemo(() => {
        const now = new Date();
        let filtered = events.filter((e) => {
            const eventDate = new Date(e.date);
            return tab === 'upcoming' ? eventDate >= now : eventDate < now;
        });

        if (selectedTag !== 'All') {
            filtered = filtered.filter(e => e.tags.includes(selectedTag));
        }

        if (search) {
            filtered = filtered.filter(e =>
                e.title.toLowerCase().includes(search.toLowerCase()) ||
                e.description.toLowerCase().includes(search.toLowerCase())
            );
        }

        filtered.sort((a, b) => {
            const diff = new Date(a.date).getTime() - new Date(b.date).getTime();
            return sortOrder === 'asc' ? diff : -diff;
        });

        return filtered;
    }, [events, tab, search, selectedTag, sortOrder]);

    if (loading) return <LoadingSpinner message="Loading events..." />;

    return (
        <div className={styles.page}>
            <section className={styles.hero}>
                <motion.div className={styles.heroContent} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                    <IoCalendarOutline className={styles.heroIcon} />
                    <h1>Events</h1>
                    <p>Ceremonies, festivals, and spiritual gatherings at Sarasavi Viharaya</p>
                </motion.div>
            </section>

            <section className="section">
                <div className="container">
                    {/* Controls */}
                    <div className={styles.controls}>
                        <div className="tabs">
                            <button className={`tab ${tab === 'upcoming' ? 'active' : ''}`} onClick={() => setTab('upcoming')}>
                                Upcoming
                            </button>
                            <button className={`tab ${tab === 'past' ? 'active' : ''}`} onClick={() => setTab('past')}>
                                Past Events
                            </button>
                        </div>

                        <div className={styles.searchSort}>
                            <div className={styles.searchBox}>
                                <IoSearchOutline />
                                <input
                                    type="text"
                                    placeholder="Search events..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                            <select
                                className={styles.sortSelect}
                                value={sortOrder}
                                onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
                            >
                                <option value="asc">Date ↑</option>
                                <option value="desc">Date ↓</option>
                            </select>
                        </div>
                    </div>

                    {/* Tags Filter */}
                    <div className={styles.tagFilters}>
                        {allTags.map((tag) => (
                            <button
                                key={tag}
                                className={`${styles.tagChip} ${selectedTag === tag ? styles.tagActive : ''}`}
                                onClick={() => setSelectedTag(tag)}
                            >
                                {tag}
                            </button>
                        ))}
                    </div>

                    {/* Events Grid */}
                    {filteredEvents.length > 0 ? (
                        <div className={styles.eventsGrid}>
                            {filteredEvents.map((event, i) => (
                                <motion.div
                                    key={event.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.05 }}
                                >
                                    <Link href={`/events/${event.id}`} className={styles.eventCard}>
                                        <div className={styles.eventImage}>
                                            {event.coverPhoto ? (
                                                <img src={event.coverPhoto} alt={event.title} />
                                            ) : (
                                                <div className={styles.eventImagePlaceholder}>
                                                    <GiLotusFlower />
                                                </div>
                                            )}
                                            {tab === 'past' && event.photos.length > 0 && (
                                                <span className={styles.photoBadge}>
                                                    <IoImagesOutline /> {event.photos.length} photos
                                                </span>
                                            )}
                                        </div>
                                        <div className={styles.eventInfo}>
                                            <div className={styles.eventTags}>
                                                {event.tags.slice(0, 2).map((tag) => (
                                                    <span key={tag} className="badge badge-gold">{tag}</span>
                                                ))}
                                            </div>
                                            <h3>{event.title}</h3>
                                            <FormattedText text={event.description} />
                                            <div className={styles.eventMeta}>
                                                <span><IoCalendarOutline /> {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                                <span><IoTimeOutline /> {event.duration}</span>
                                            </div>
                                            {tab === 'upcoming' && (
                                                <div className={styles.eventCountdown}>
                                                    <CountdownTimer targetDate={event.date} compact />
                                                </div>
                                            )}
                                            <span className={styles.eventArrow}><IoArrowForward /></span>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className={styles.empty}>
                            <GiLotusFlower />
                            <p>No {tab} events found</p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
