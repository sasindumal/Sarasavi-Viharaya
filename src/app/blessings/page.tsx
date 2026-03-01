'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { GiLotusFlower } from 'react-icons/gi';
import { IoPersonOutline } from 'react-icons/io5';
import styles from './page.module.css';

const blessings = [
    {
        id: 1,
        personName: 'Most Ven. Kiribathgoda Gananananda Thero',
        personTitle: 'Chief Sangha Nayaka, Mahamevnawa Buddhist Monastery',
        message: 'May the Sarasavi Viharaya at the University of Jaffna continue to be a beacon of wisdom and compassion. The dedication of the students who built this sacred place with their own hands is a testament to the living Dhamma. May this temple bring peace and enlightenment to all who seek refuge within its grounds.',
        photo: null,
    },
    {
        id: 2,
        personName: 'Prof. A. Atputharajah',
        personTitle: 'Founding Dean, Faculty of Engineering, University of Jaffna',
        message: 'Sarasavi Viharaya represents the unity and determination of students across all communities. From the initial concept to the magnificent temple complex we see today, this journey has been one of overcoming obstacles through collective effort. I am deeply moved by the interfaith harmony this project has fostered.',
        photo: null,
    },
    {
        id: 3,
        personName: 'Eng. Saliya Sampath',
        personTitle: 'Senior Lecturer, Faculty of Engineering & Senior Treasurer, Buddhist Brotherhood Society',
        message: 'Building Sarasavi Viharaya has been one of the most fulfilling experiences of my life. Watching students from different batches come together, working overnight, carrying cement and bricks — it showed me the true power of faith and devotion. This temple is not just a building; it is a living monument to student dedication.',
        photo: null,
    },
    {
        id: 4,
        personName: 'Prof. Lilantha Samaranayake',
        personTitle: 'University of Peradeniya',
        message: 'The Sarasavi Viharaya stands as a remarkable achievement in the northern region of Sri Lanka. The compassion and hard work of the students, combined with the guidance of the Buddhist monks, have created a space where anyone can find spiritual solace. My involvement with this project has been a source of great merit.',
        photo: null,
    },
    {
        id: 5,
        personName: 'Ven. Nalande Pawara Thero',
        personTitle: 'Chief Patron, Sarasavi Viharaya',
        message: 'The construction of the Sri Maha Bodhi Prakaraya and the relic palace at Sarasavi Viharaya has been a sacred duty. May the Triple Gem — the Buddha, the Dhamma, and the Sangha — continue to bless this temple and all who contribute to its growth. Saadhu! Saadhu! Saadhu!',
        photo: null,
    },
    {
        id: 6,
        personName: 'Mr. Ajantha Premarathna',
        personTitle: 'Quantity Surveyor & Key Donor',
        message: 'Supporting the construction of the stupa at Sarasavi Viharaya has been one of the most meritorious deeds I have undertaken. The students\' commitment inspired me to continue fundraising efforts even during the most challenging economic times. This temple will serve generations of students to come.',
        photo: null,
    },
];

export default function BlessingsPage() {
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
                                        {blessing.photo ? (
                                            <img src={blessing.photo} alt={blessing.personName} />
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
                                <p className={styles.message}>{blessing.message}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
