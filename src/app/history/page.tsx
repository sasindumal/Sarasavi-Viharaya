'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { GiLotusFlower, GiTempleGate } from 'react-icons/gi';
import { IoLeafOutline } from 'react-icons/io5';
import styles from './page.module.css';

const timelineData = [
    { year: '2014', title: 'The Beginning', text: 'Kilinochchi premises commenced operations in February 2014. Discussions about establishing a religious hub began.' },
    { year: '2015', title: 'Initial Plans', text: 'A tentative master plan for the temple was developed with input from agriculture and engineering students, with Nagadeepaya as thematic inspiration.' },
    { year: '2016', title: 'A Turning Point', text: 'The Buddha statue at the shrine was vandalized. Prof. Mrs. T. Mikunthan personally funded the acquisition of a replacement statue.' },
    { year: '2018', title: 'Buddhist Society Founded', text: 'The first AGM of the Buddhist Society was held on March 3, 2018. Mr. Gayal Wanaguru was elected as the first president.' },
    { year: 'Sep 2018', title: 'Temple Construction Begins', text: 'The Jaya Sri Maha Bodhi tree was planted on September 24. The temple was named "Sarasavi Viharaya." Foundation stone laid on December 14.' },
    { year: 'Jan 2019', title: 'Bodhi Prakara & Relic Palace', text: 'Construction of the Bodhi Prakara commenced. The Relic Palace was completed in seven days of student labor and opened on March 2.' },
    { year: 'Jul 2019', title: 'Stupa Foundation & Meditation Hall', text: 'Base stone for the stupa was laid. Meditation hall opened. CEB provided permanent electricity.' },
    { year: 'Nov 2019', title: 'Sacred Relic Deposit', text: 'Historic relic deposit ceremony held, including relics of Lord Buddha and Arahant Maha Theros.' },
    { year: 'Mar 2020', title: 'Stupa Pinnacle Unveiled', text: 'Pinnacle unveiling ceremony presided by Most Ven. Kiribathgoda Gananananda Thero. Broadcast on Shraddha TV.' },
    { year: '2020-21', title: 'Through COVID-19', text: 'Despite the pandemic, construction continued on the boundary wall, gates, Dhamma Shala foundation, and lotus pond.' },
    { year: 'Mar 2022', title: 'Main Hall Roofing Complete', text: 'With Dr. Bandula Abeysundara\'s support, the 5,000 sq.ft. main hall roofing was completed.' },
    { year: 'May 2022', title: 'Main Hall Floor & Statue', text: 'E20 batch concreted the entire floor (187 cement bags in 5 days). An 8-foot Buddha statue in Ashirwada Mudra pose was installed.' },
    { year: 'May 2023', title: 'Vesak Festival & Unveiling', text: 'Two-day Vesak festival with the first rotating Vesak lantern on Kilinochchi premises. Buddha statue unveiled on Vesak Poya day.' },
    { year: 'Aug 2023', title: '5th Anniversary', text: 'Temple\'s 5th anniversary: opening of Bodhi Prakaraya, Saman Devalaya, Dolosmahe Pahana, and kitchen.' },
    { year: 'Feb 2024', title: 'Main Hall Grand Opening', text: 'Main hall officially opened after 3.5 years of construction, attended by the Deputy Vice-Chancellor. Monthly Sil observance programs began.' },
];

export default function HistoryPage() {
    return (
        <div className={styles.page}>
            {/* Hero */}
            <section className={styles.hero}>
                <motion.div
                    className={styles.heroContent}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <GiTempleGate className={styles.heroIcon} />
                    <h1>The Journey</h1>
                    <p>History of the Sarasavi Viharaya — From vision to reality</p>
                </motion.div>
            </section>

            {/* Vision Section */}
            <section className="section">
                <div className="container container-sm">
                    <motion.div
                        className={styles.introCard}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2>The Vision</h2>
                        <p>
                            Why was a Buddhist temple needed at the University of Jaffna? With approximately 4,000 Buddhist students residing and studying at the university, there was a profound spiritual and cultural need. The Kilinochchi premises, established in 2014, lacked a dedicated Buddhist place of worship where students could find spiritual solace amidst their academic journey.
                        </p>
                        <p>
                            Sarasavi Viharaya was conceived as more than a temple — it was envisioned as a spiritual sanctuary that would nurture the inner growth of students, foster interfaith harmony, and serve as a bridge connecting diverse communities through the universal values of compassion, wisdom, and peace.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Temple Features */}
            <section className="section" style={{ background: 'rgba(252,223,162,0.1)' }}>
                <div className="container">
                    <div className="section-header">
                        <h2>Temple Features</h2>
                        <p>A magnificent complex built with devotion and precision</p>
                    </div>
                    <div className={styles.featuresGrid}>
                        {[
                            { title: '10-Meter Stupa', desc: 'Modeled after Ruwanweliseya, prominently visible from the main gate, flanked by a lotus pond with water sprinkler.' },
                            { title: 'Relic Palace', desc: 'Houses sacred relics of Lord Buddha and Arahant Maha Theros, along with copper plates inscribed with Suttas.' },
                            { title: 'Main Preaching Hall', desc: '5,000-square-foot hall featuring an 8-foot-tall Buddha statue in "Ashirwada Mudra" pose.' },
                            { title: 'Sathbudu Mandapa', desc: 'Seven Buddha statues and shrines, located behind the stupa, funded by Shraddha TV.' },
                            { title: 'Bodhi Trees & Prakaras', desc: 'Jaya Sri Maha Bodhi, Ananda Bodhi, and sacred Banyan from Nagadeepa Temple with golden and silver fences.' },
                            { title: 'Saman Devalaya', desc: 'Contains a granite Sri Pathula and statue of God Sumana Saman, sanctified at Sri Pada mountain.' },
                            { title: 'Meditation Hall', desc: 'Built around the Relic Palace for hosting religious events regardless of weather conditions.' },
                            { title: 'Standing Buddha', desc: '12-foot-high statue resembling the Avukana Buddha, installed at the main compound.' },
                        ].map((feature, i) => (
                            <motion.div
                                key={i}
                                className={styles.featureCard}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.05 }}
                            >
                                <IoLeafOutline className={styles.featureIcon} />
                                <h4>{feature.title}</h4>
                                <p>{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Timeline */}
            <section className="section">
                <div className="container container-sm">
                    <div className="section-header">
                        <h2>The Journey Through Time</h2>
                        <p>Key moments in the construction and development of Sarasavi Viharaya</p>
                    </div>

                    <div className={styles.timeline}>
                        {timelineData.map((item, i) => (
                            <motion.div
                                key={i}
                                className={styles.timelineItem}
                                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 }}
                            >
                                <div className={styles.timelineDot}>
                                    <GiLotusFlower />
                                </div>
                                <div className={styles.timelineContent}>
                                    <span className={styles.timelineYear}>{item.year}</span>
                                    <h3>{item.title}</h3>
                                    <p>{item.text}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Community & Interfaith */}
            <section className="section" style={{ background: 'rgba(252,223,162,0.1)' }}>
                <div className="container container-sm">
                    <motion.div
                        className={styles.introCard}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2>Interfaith Harmony & Community Service</h2>
                        <p>
                            Sarasavi Viharaya has become a symbol of interfaith harmony at the University of Jaffna. Buddhist students contributed materials to the Hindu temple construction, while the Buddhist temple provided water to the church and Hindu temple during droughts. Christian students used the temple for carol practice, and Sinhala students joined Tamil traditions like Pongal and Annadanam.
                        </p>
                        <p>
                            The temple houses a Tamil-medium library, hosts free medical camps, distributes school supplies, and serves as a cultural bridge. During Vesak and Poson festivals, Tamil staff and villagers participate in celebrations and Dansalas. Through community outreach and cultural exchange, the temple promotes peace, mutual respect, and lasting harmony.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Conclusion */}
            <section className="section">
                <div className="container container-sm" style={{ textAlign: 'center' }}>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <GiLotusFlower style={{ fontSize: '2.5rem', color: 'var(--sacred-gold)', marginBottom: 'var(--space-lg)' }} />
                        <h2>A Testament to Devotion</h2>
                        <p style={{ maxWidth: '700px', margin: 'var(--space-lg) auto 0', fontSize: '1.05rem' }}>
                            The Buddhist temple at the University of Jaffna exemplifies how dedicated efforts and collaborative spirit can overcome significant challenges and foster interfaith and cultural integration. Through its various initiatives, the temple has made a substantial impact on the university community and beyond, promoting mutual respect and understanding among diverse groups.
                        </p>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
