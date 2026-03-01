'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { IoCalendarOutline, IoTimeOutline, IoSearchOutline, IoFilterOutline, IoImagesOutline, IoArrowForward } from 'react-icons/io5';
import { GiLotusFlower } from 'react-icons/gi';
import CountdownTimer from '@/components/ui/CountdownTimer';
import styles from './page.module.css';

// Demo events data - in production this comes from Firestore
const demoEvents = [
    {
        id: '1',
        title: 'Vesak Festival 2026',
        description: 'Annual Vesak celebration with lantern competition, Sil observance, Dansala, and Dharma sermons.',
        date: '2026-05-12T06:00:00Z',
        duration: '2 days',
        tags: ['Vesak', 'Festival', 'Sil Observance'],
        coverPhoto: 'https://images.unsplash.com/photo-1590142035354-4612646a4394?w=800&h=500&fit=crop',
        photos: [],
        notifySubscribers: true,
        isPublished: true,
    },
    {
        id: '2',
        title: 'Poson Poya Celebration',
        description: 'Commemorating the arrival of Buddhism to Sri Lanka with special poojas and Dhamma programs.',
        date: '2026-06-10T06:00:00Z',
        duration: '1 day',
        tags: ['Poson', 'Poya'],
        coverPhoto: 'https://images.unsplash.com/photo-1544967082-d9d25d867d66?w=800&h=500&fit=crop',
        photos: [],
        notifySubscribers: true,
        isPublished: true,
    },
    {
        id: '3',
        title: 'Monthly Sil Observance — March',
        description: 'Full-day Sil program in the main preaching hall with meditation and Dhamma discussions.',
        date: '2026-03-14T06:00:00Z',
        duration: '1 day',
        tags: ['Sil Observance', 'Meditation'],
        coverPhoto: '',
        photos: [],
        notifySubscribers: true,
        isPublished: true,
    },
    {
        id: '4',
        title: 'Pirith Chanting Ceremony',
        description: 'Overnight Pirith chanting organized by E22 batch, seeking blessings for the temple and university community.',
        date: '2025-12-31T18:00:00Z',
        duration: 'Overnight',
        tags: ['Pirith Chanting', 'Ceremony'],
        coverPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=500&fit=crop',
        photos: [
            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
            'https://images.unsplash.com/photo-1544967082-d9d25d867d66?w=400&h=300&fit=crop',
            'https://images.unsplash.com/photo-1512036666432-2181c1f26f3b?w=400&h=300&fit=crop',
        ],
        notifySubscribers: false,
        isPublished: true,
    },
    {
        id: '5',
        title: 'Temple 7th Anniversary Celebration',
        description: 'Celebrating seven years since the founding of Sarasavi Viharaya with special ceremonies and community events.',
        date: '2025-09-24T06:00:00Z',
        duration: '1 day',
        tags: ['Anniversary', 'Celebration'],
        coverPhoto: 'https://images.unsplash.com/photo-1590142035354-4612646a4394?w=800&h=500&fit=crop',
        photos: [
            'https://images.unsplash.com/photo-1590142035354-4612646a4394?w=400&h=300&fit=crop',
            'https://images.unsplash.com/photo-1544967082-d9d25d867d66?w=400&h=300&fit=crop',
        ],
        notifySubscribers: false,
        isPublished: true,
    },
    {
        id: '6',
        title: 'Free Medical Camp',
        description: 'Community health camp providing free medical consultations and health checkups.',
        date: '2025-06-15T08:00:00Z',
        duration: '1 day',
        tags: ['Community Service', 'Medical Camp'],
        coverPhoto: '',
        photos: [
            'https://images.unsplash.com/photo-1512036666432-2181c1f26f3b?w=400&h=300&fit=crop',
        ],
        notifySubscribers: false,
        isPublished: true,
    },
];

const allTags = ['All', 'Vesak', 'Poson', 'Poya', 'Pirith Chanting', 'Sil Observance', 'Meditation', 'Festival', 'Ceremony', 'Anniversary', 'Celebration', 'Community Service', 'Medical Camp'];

export default function EventsPage() {
    const [tab, setTab] = useState<'upcoming' | 'past'>('upcoming');
    const [search, setSearch] = useState('');
    const [selectedTag, setSelectedTag] = useState('All');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

    const now = new Date();

    const filteredEvents = useMemo(() => {
        let events = demoEvents.filter((e) => {
            const eventDate = new Date(e.date);
            return tab === 'upcoming' ? eventDate > now : eventDate <= now;
        });

        if (selectedTag !== 'All') {
            events = events.filter(e => e.tags.includes(selectedTag));
        }

        if (search) {
            events = events.filter(e =>
                e.title.toLowerCase().includes(search.toLowerCase()) ||
                e.description.toLowerCase().includes(search.toLowerCase())
            );
        }

        events.sort((a, b) => {
            const diff = new Date(a.date).getTime() - new Date(b.date).getTime();
            return sortOrder === 'asc' ? diff : -diff;
        });

        return events;
    }, [tab, search, selectedTag, sortOrder]);

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
                                            <p>{event.description}</p>
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
