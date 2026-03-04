'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { GiLotusFlower, GiTempleGate } from 'react-icons/gi';
import { IoLeafOutline } from 'react-icons/io5';
import styles from './page.module.css';

const timelineData = [
    {
        year: '18 Sep 2018',
        title: 'Initial Site Visit',
        text: 'A pivotal moment as key members visited the proposed site. Prof. Athputharajah (Founding Dean of Engineering Faculty, University of Jaffna), Eng. Saliya Sampath, Eng. M. Vignarajah, and Dr. Kathirgamanathan visited the site. The land, located near the northern boundary of the university, was leveled but overgrown with bushes, with two security officers stationed on site. This historic visit marked the very first tangible step toward transforming this quiet patch of land into the flourishing spiritual sanctuary it is today.',
    },
    {
        year: '22 Sep 2018',
        title: 'Land Surveying',
        text: 'The crucial task of surveying the allocated land was undertaken by the dedicated students of the 2016 Engineering batch. Applying their academic knowledge to this sacred project, they meticulously surveyed the grounds and prepared the comprehensive topographical maps and plans required to lay the foundation for the Sarasavi Viharaya.',
    },
    {
        year: '23 Sep 2018',
        title: 'Land Preparation',
        text: 'Under the leadership of Mr. Gayal Wanaguru, President of the Buddhist Society, a dedicated group of students gathered to clear and prepare the land for the upcoming Bodhi tree planting ceremony. Their collective efforts not only readied the soil for the sacred saplings but also adorned the premises with beautiful decorations, setting a reverent and auspicious atmosphere for the historic events to follow.',
    },
    {
        year: '24 Sep 2018',
        title: 'Sacred Bodhi Plantation',
        text: 'The Jaya Sri Maha Bodhi sapling from Anuradhapura and the Ananda Bodhi sapling from the Nelligala International Buddhist Centre were brought to the Viharaya grounds in a majestic procession amidst an unseasonal heavy downpour that broke a six-month dry spell. On the auspicious Binara Poya day, the sacred Bodhi saplings were planted amidst the chanting of Seth Pirith by the Maha Sangha. That evening, Prof. Atputharajah unveiled the official name board of the Sarasavi Viharaya — a deeply historic moment signifying the birth of this spiritual sanctuary.',
    },
    {
        year: '29 Oct 2018',
        title: 'Kiripalu Bodhi Plantation',
        text: 'Upon a humble request, the Chief Incumbent of the Nagadeepa Rajamaha Viharaya, Most Venerable Navadagala Padumakiththi Tissa Thero, graciously gifted a sacred Kiripalu Bodhi sapling. Devoted students reverently transported the sacred sapling from Nagadeepa to Kilinochchi. On November 3, 2018, the sacred Kiripalu Bodhi sapling was formally planted within the Viharaya grounds.',
    },
    {
        year: '18 Nov 2018',
        title: 'Atavisi Bodhi & Tree Plantation',
        text: 'The Viharaya grounds were blessed with the planting of the sacred Atavisi Bodhi (28 Bodhi trees representing the 28 past Buddhas) alongside approximately 200 valuable saplings donated by the Green Spin Reforestation organization. The sacred Atavisi Bodhi saplings were escorted to the temple under traditional pearl umbrellas (muthukuda). Trees were also planted at the lands of the mosque, Hindu temple, and church with their permission.',
    },
    {
        year: '28 Nov 2018',
        title: 'First Atavisi Bodhi Pooja',
        text: 'The inaugural Bodhi Pooja dedicated to the newly planted Atavisi Bodhi trees was beautifully organized by students of the Faculty of Technology. Two Venerable Monks were invited from the Anuradhapura Mahamevnawa Bhavana Asapuwa to lead this meritorious event, filling the evening with deep spiritual devotion and tranquil chanting.',
    },
    {
        year: '14 Dec 2018',
        title: 'Main Temple Foundation',
        text: 'The foundation stone for the Sarasavi Viharaya (Jaya Sri Maha Bodhi Prakaraya) was officially laid by the Vice-Chancellor, Prof. Ratnam Vigneswaran. The ceremony was blessed with Seth Pirith chanting by Ven. Ingiriye Dhammalankara Thero. Distinguished guests included Prof. A. Atputharajah (Dean, Faculty of Engineering), Prof. Thushyanthy Mikunthan (Dean, Faculty of Agriculture), Mrs. S. Arulanantham (Librarian), and Mr. A. J. Christy (Deputy Registrar).',
    },
    {
        year: '21 Feb 2019',
        title: 'Dathu Mandiraya Foundation',
        text: 'The foundation stone was laid for the Dathu Mandiraya (Relic Chamber), marking the very first physical construction of the Sarasavi Viharaya, graced by Ven. Nalande Pawara Thero. The sacred relics and offering items were provided by \'The Buddhist\' television channel. Showcasing remarkable dedication, the university students completed the entire construction in just ten days. On March 3, 2019, the completed Dathu Mandiraya was formally offered to the Buddha Sasana with relics enshrined by Ven. Bandarawela Muditha Thero.',
    },
    {
        year: '9 Mar 2019',
        title: 'First Buddha Statue',
        text: 'The \'Sasunketha Aswaddamu\' circle of friends donated an exquisitely crafted, five-foot-tall Buddha statue valued at approximately Rs. 250,000. Brought to the Viharaya with utmost reverence, the statue was enshrined within the Dathu Mandiraya during a special pooja led by Ven. Ingiriye Dhammalankara Thero of the Kilinochchi Viharaya.',
    },
    {
        year: '5 Jul 2019',
        title: 'Meditation Hall Opening',
        text: 'A small hall surrounding the Dathu Mandiraya was constructed through the generous financial contribution of Prof. Lilantha Samaranayake (University of Peradeniya). Officially offered to the Buddha Sasana on the same day as the Sarasavi Seya foundation stone ceremony, blessed by Ven. Kadawatha Saminda Thero. The very first Sanghika Dana of the Sarasavi Viharaya was held within this newly opened hall.',
    },
    {
        year: '5 Jul 2019',
        title: 'Sarasavi Seya Foundation',
        text: 'The foundation stone for the magnificent Sarasavi Maha Seya (Stupa) was laid under the gracious blessings and guidance of the Maha Sangha, led by Ven. Kadawatha Saminda Thero. A special Kanchuka Pooja (offering of sacred robes) was reverently held for the Bodhi trees. The second base stone laying was done at ground level on July 8, 2019, as per traditional rituals.',
    },
    {
        year: '17 Aug 2019',
        title: 'Sath Budu Mandapaya',
        text: 'With the noble intention of venerating the seven Supreme Buddhas, \'Shraddha\' Television sponsored the construction of the Sath Budu Mandapaya. Fueled by the dedication and volunteer labor of university students, the shrine was completed and formally offered to the Buddha Sasana. A special Sath Budu Vandana and an illuminating Dhamma sermon were conducted.',
    },
    {
        year: '10 Nov 2019',
        title: 'Dathu Nidana Ceremony',
        text: 'The relic enshrinement ceremony of the Sarasavi Maha Seya was held with great devotion. Fifteen sacred relics of Lord Buddha, along with relics of Arahants Sariputta, Moggallana, Ananda, Bakkula, and Sivali were enshrined. Sutta discourses inscribed on copper plates were placed within. Ven. Galgamuwe Shanthabodhi Thero placed an ebony wood Buddha statue. Students conducted an overnight Pirith chanting ceremony the night before.',
    },
    {
        year: '27 Jan 2020',
        title: 'Koth Paladavima',
        text: 'University students completed the Stupa construction in just four months by enshrining sacred relics, a Blue Sapphire-topped silver casket, and copper-plated scriptures within the square chamber. Students decorated the stupa with flowers and conducted an overnight Pirith chanting session. The following morning, the stupa was crowned with its pinnacle as per traditional rituals.',
    },
    {
        year: 'Mar 2020',
        title: 'Walakulu Bamma & Boundary Wall',
        text: 'A traditional Walakulu Bamma, evoking the serene majesty of the iconic cloud wall near the Sri Dalada Maligawa in Kandy, was constructed to adorn the front boundary. The surrounding boundary walls were erected and main gates securely installed, ensuring the sacred grounds are both safely enclosed and majestically presented.',
    },
    {
        year: '7 Mar 2020',
        title: 'Grand Opening of Sarasavi Seya',
        text: 'The magnificent Sarasavi Maha Seya was formally offered to the Gautama Buddha Sasana, led by Most Venerable Kiribathgoda Gnanananda Thero. This was the most extraordinary and heavily attended event at the Viharaya. The Aukana Buddha replica was unveiled, the \'Sadaham\' Library inaugurated, and meditation huts offered to the Sangha. The Venerable Thero remarked that the immense merit and beauty of this endeavor were truly beyond words.',
    },
    {
        year: '24 Sep 2020',
        title: 'Dharma Shalawa Foundation',
        text: 'Once COVID-19 was somewhat controlled, the foundation stone for the 5,000-square-foot Dharmashala (Preaching Hall) was laid, coinciding with the second anniversary of the Sarasavi Vihara. The ceremony was conducted amidst Seth Pirith by Ven. Bandarawela Dhammawijaya Thero. The construction spanned over four years, making it the most expensive and longest project. A nearly 9-foot Buddha statue — the largest at the Viharaya — was constructed upon the stage.',
    },
    {
        year: '24 Sep 2023',
        title: '5th Anniversary Special Opening',
        text: 'Marking the 5th Anniversary, several completed projects were offered to the Buddha Sasana: the protective walls of Jaya Sri Maha Bodhi, Ananda Bodhi, and Kiripalu Bodhi, plus the Dolosmahe Pahana (Perpetual Lamp), the Siri Pa Vihara (Saman Dewalaya), and the Kitchen. The ceremony was led by Ven. Aludeniye Subodhi Thero, Chief Incumbent of Seruwila Rajamaha Vihara. The Saman Devalaya houses a granite Sri Pathula and statue of God Saman, sanctified at Sri Pada by the 2018 Engineering batch.',
    },
    {
        year: '10 Feb 2024',
        title: 'Grand Opening of Dharma Shalawa',
        text: 'The completed 5,000-square-foot Dharmashala and four meditation cells were officially offered to the Buddha Sasana. The ceremony was presided over by the Deputy Vice Chancellor, Prof. S. Kannadasan, with Ven. Aludeniye Subodhi Thero leading the Maha Sangha. Midday alms were offered within the newly inaugurated Dharmashala, with celebrations featuring traditional dance, music, and insightful speeches.',
    },
    {
        year: '24 Sep 2024',
        title: 'Danashalawa & Sangawasaya Foundation',
        text: 'The foundation stone for the Monks\' Residence (Sangawasa) with Dining Hall (Danashalawa) was laid on the 6th anniversary. The ceremony was performed by the Maha Sangha, led by Ven. Bandarawela Muditha Thero and Ven. Yatiberiye Somagnana Thero. Excavation and foundation work began in June 2025.',
    },
    {
        year: '7 Mar 2026',
        title: 'Final Grand Offering',
        text: 'The Sangawasaya and Danashalawa complex was officially offered to the Gautama Buddha Sasana by the Vice Chancellor, Prof. S. Srisatkunarajah. The ceremony was graced by a delegation from the Mahamevnawa Sangha Council, including Ven. Anamaduwe Sumedha Thero, Ven. Yatiberiye Somagnana Thero, Ven. Pannala Sumanawansha Thero, and Ven. Ankumbure Amithadeepa Thero. That evening, the fully completed Sarasavi Vihara — constructed over 7.5 years — was fully dedicated to the Buddha Sasana, concluding this great meritorious deed.',
    },
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
