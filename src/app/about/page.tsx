'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { GiLotusFlower, GiMeditation, GiTempleGate } from 'react-icons/gi';
import { IoLeafOutline, IoPeopleOutline, IoHeartOutline, IoBookOutline } from 'react-icons/io5';
import styles from './page.module.css';

export default function AboutPage() {
    return (
        <div className={styles.page}>
            <section className={styles.hero}>
                <motion.div className={styles.heroContent} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                    <GiMeditation className={styles.heroIcon} />
                    <h1>About Sarasavi Viharaya</h1>
                    <p>A sacred sanctuary of peace, wisdom, and cultural harmony</p>
                </motion.div>
            </section>

            <section className="section">
                <div className="container container-sm">
                    <motion.div className={styles.card} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                        <h2>About the Temple</h2>
                        <p>
                            Sarasavi Viharaya, situated on the Kilinochchi premises of the University of Jaffna, represents a significant achievement for the Buddhist community. Constructed primarily by university students, this project reflects their dedication and sacrifices.
                        </p>
                        <p>
                            With approximately 4,000 Buddhist students residing and studying at the University of Jaffna, the temple serves to meet their spiritual and religious needs. The temple complex is positioned at the northern boundary of the university&apos;s spiritual hub, adjacent to the Hindu temple. This hub, spanning 8 acres, is designed to foster tranquility and spiritual growth among students.
                        </p>
                    </motion.div>

                    <div className={styles.valuesGrid}>
                        {[
                            { icon: <IoHeartOutline />, title: 'Compassion', text: 'Serving students and communities with loving-kindness and generosity.' },
                            { icon: <GiLotusFlower />, title: 'Wisdom', text: 'Nurturing inner growth through meditation, Dhamma, and spiritual practice.' },
                            { icon: <IoPeopleOutline />, title: 'Harmony', text: 'Fostering interfaith understanding and cultural integration across communities.' },
                            { icon: <IoBookOutline />, title: 'Education', text: 'Supporting academic life with spiritual guidance and moral values.' },
                        ].map((v, i) => (
                            <motion.div key={i} className={styles.valueCard} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                                <span className={styles.valueIcon}>{v.icon}</span>
                                <h4>{v.title}</h4>
                                <p>{v.text}</p>
                            </motion.div>
                        ))}
                    </div>

                    <motion.div className={styles.card} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ marginTop: 'var(--space-2xl)' }}>
                        <h2>Buddhist Brotherhood Society</h2>
                        <p>
                            The Buddhist Society of the University of Jaffna was founded on March 3, 2018, and officially registered under the university. The society organizes religious activities, cultural events, Vesak and Poson festivals, Pirith chanting ceremonies, Sil observance programs, and community service initiatives.
                        </p>
                        <p>
                            Under the guidance of Eng. Saliya Sampath (Senior Treasurer) and the advisory committee, the society continues to maintain and develop Sarasavi Viharaya while promoting the Dhamma among the university community.
                        </p>
                    </motion.div>

                    <motion.div className={styles.card} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ marginTop: 'var(--space-2xl)' }}>
                        <h2>Facilities</h2>
                        <p>
                            The temple complex includes a 5,000 sq.ft. main preaching hall, meditation hall, relic palace, Saman Devalaya, Sathbudu Mandapa, kitchen facilities, water supply, and separate restrooms. The area is adorned with rare and valuable plants, flowering species, and Australian grass, with internal roads paved with interlocking stones.
                        </p>
                        <p>
                            Solar lights along the entrance road ensure continuous illumination. The main gate features ancient Buddhist motifs including Bahirawa Rupa and Narilatha Pushpa, topped with Punkalas symbolizing prosperity. The decorative Walakulu Bamma is modeled after the Temple of the Tooth in Kandy.
                        </p>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
