'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { IoHeartOutline, IoPersonOutline, IoConstructOutline, IoStarOutline } from 'react-icons/io5';
import { GiLotusFlower } from 'react-icons/gi';
import styles from './page.module.css';

const donors = [
    { name: 'Mr. Ajantha Premarathna', desc: 'Key supporter of stupa construction, fundraising, and tile procurement from Dubai.' },
    { name: 'Shraddha TV', desc: 'Funded the construction of the Sath Budu Mandapa with seven Buddha statues.' },
    { name: 'Dr. Bandula Abeysundara', desc: 'Crucial support from Canada for the main hall roof construction.' },
    { name: 'Ven. Nalande Pawara Thero & Prof. Lilantha Samaranayake', desc: 'First major donors — overseeing the Sri Maha Bodhi Prakaraya and meditation hall.' },
    { name: 'Sasun Ketha Asawaddamu Team', desc: 'Installed the first Buddha statue and painted the stupa multiple times.' },
    { name: 'Ven. Welimada Saddaseela Thero', desc: 'Contributed the pinnacle and Chuda Maniikkaya to the stupa.' },
];

const workforce = [
    { name: 'Prof. A. Atputharajah', desc: 'Founding Dean of Faculty of Engineering — pivotal role in concept and registration of the Buddhist Society.' },
    { name: 'Eng. Saliya Sampath', desc: 'Senior Lecturer & Senior Treasurer — led the temple project from inception to completion.' },
    { name: 'Eng. Suranga Karunanayake', desc: 'Designed the roof structure of the main preaching hall.' },
    { name: 'Engineering Batches E14-E21', desc: 'Conducted land surveys, prepared BOQs, building plans, and countless Shramadana days.' },
    { name: 'Technology Batches Tech 16-19', desc: 'Organized Pirith chanting ceremonies and construction support.' },
    { name: 'Agriculture Faculty Students', desc: 'Planted rare and valuable plants, grass, and maintained the temple gardens.' },
];

const special = [
    { name: 'Prof. Vasanthi Arasarathnam', desc: 'Vice Chancellor who developed the concept of the spiritual hub.' },
    { name: 'Prof. Mrs. T. Mikunthan', desc: 'Dean of Agriculture Faculty who personally funded the replacement Buddha statue after vandalism.' },
    { name: 'Mr. Gayal Wanaguru (E14)', desc: 'First President of the Buddhist Society of University of Jaffna.' },
    { name: 'Local Villagers & Businesses', desc: 'Provided employment, materials, and community support throughout construction.' },
    { name: 'Sanken Pvt. Ltd.', desc: 'Provided the crane boom for relocating the sacred Bodhi tree.' },
    { name: 'Mahamevnawa Monastery Monks', desc: 'Spiritual guidance and advisory committee participation throughout the project.' },
];

const categories = [
    { title: 'Gratitude to Donors', icon: <IoHeartOutline />, items: donors, color: 'var(--sacred-gold)' },
    { title: 'Gratitude to the Workforce', icon: <IoConstructOutline />, items: workforce, color: 'var(--saffron-amber)' },
    { title: 'Special Mentions', icon: <IoStarOutline />, items: special, color: 'var(--vermillion-temple)' },
];

export default function AcknowledgmentsPage() {
    return (
        <div className={styles.page}>
            <section className={styles.hero}>
                <motion.div className={styles.heroContent} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                    <GiLotusFlower className={styles.heroIcon} />
                    <h1>Punyanumodana</h1>
                    <p>Acknowledgments — With deepest gratitude to all who made this sacred journey possible</p>
                </motion.div>
            </section>

            <section className="section">
                <div className="container">
                    {categories.map((cat, ci) => (
                        <div key={ci} className={styles.category}>
                            <div className={styles.categoryHeader}>
                                <span className={styles.categoryIcon} style={{ color: cat.color }}>{cat.icon}</span>
                                <h2>{cat.title}</h2>
                            </div>
                            <div className={styles.ackGrid}>
                                {cat.items.map((item, i) => (
                                    <motion.div
                                        key={i}
                                        className={styles.ackCard}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.05 }}
                                    >
                                        <div className={styles.ackAvatar}><IoPersonOutline /></div>
                                        <h4>{item.name}</h4>
                                        <p>{item.desc}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
