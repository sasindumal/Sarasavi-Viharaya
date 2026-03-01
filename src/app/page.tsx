'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { IoCalendarOutline, IoTimeOutline, IoLocationOutline, IoSparkles, IoArrowForward, IoLeafOutline, IoBookOutline, IoPeopleOutline, IoHeartOutline, IoMailOutline } from 'react-icons/io5';
import SubscribeForm from '@/components/ui/SubscribeForm';
import { GiLotusFlower, GiTempleGate, GiMeditation } from 'react-icons/gi';
import styles from './page.module.css';

const heroImages = [
  '/images/hero/475231181_925383733057321_5283869580277225273_n.jpg',
  '/images/hero/480517481_940426461553048_8919177266438342452_n.jpg',
  '/images/hero/MG_0240127_WA0029.jpg',
  '/images/hero/567653863_1125592359703123_8640014806844139420_n.jpg',
  '/images/hero/473248200_916041497324878_4161709645087724954_n.jpg',
  '/images/hero/496228832_1003508721911488_2894417262030954422_n.jpg',
  '/images/hero/475128638_925386989723662_8005911211409710894_n.jpg',
  '/images/hero/481022899_613458968310277_642441624297442853_n.jpg',
  '/images/hero/475774533_929545149307846_951330107481697522_n.jpg',
  '/images/hero/488197420_973316398264054_8122485867613343467_n.jpg',
  '/images/hero/345602955_1967286096943979_1313718540280614763_n.jpg',
  '/images/hero/497808715_1003716208557406_6722095789380330914_n.jpg',
  '/images/hero/474473585_587636634225844_619224160787962205_n.jpg',
  '/images/hero/480313670_940427361552958_5541827970641091345_n.jpg',
  '/images/hero/475855633_930077869254574_4057070070168432874_n.jpg',
  '/images/hero/482271543_952313253697702_3437205822800218792_n.jpg',
  '/images/hero/473615354_916041350658226_8506833914250578864_n.jpg',
  '/images/hero/497399333_1003446541917706_6356858966780589776_n.jpg',
  '/images/hero/475279847_925386743057020_7855073235877510097_n.jpg',
  '/images/hero/495907682_1003714858557541_8937388858290107030_n.jpg',
  '/images/hero/487829166_973313778264316_1226237895276945489_n.jpg',
  '/images/hero/474561410_587636637559177_2715713182414980850_n.jpg',
  '/images/hero/480641464_940426508219710_7425075929904156060_n.jpg',
  '/images/hero/565700734_1125594076369618_2116034996009761803_n.jpg',
  '/images/hero/475004654_925386776390350_5072444034572933485_n.jpg',
  '/images/hero/493728816_1003511565244537_1645475279227700214_n.jpg',
  '/images/hero/476227221_932098729052488_210902307500061451_n.jpg',
  '/images/hero/475745202_929545052641189_9110076294111367069_n.jpg',
  '/images/hero/480315143_938663418396019_2132502338318193164_n.jpg',
  '/images/hero/496226179_1003715495224144_8260389142550735901_n.jpg',
  '/images/hero/475089490_925383553057339_1891217949296832767_n.jpg',
  '/images/hero/479972962_940426504886377_6074431599684253597_n.jpg',
  '/images/hero/468160360_122138251484362665_4400518661516981987_n.jpg',
  '/images/hero/475209214_925387043056990_4164220517376122393_n.jpg',
  '/images/hero/481665284_952314650364229_5480874976322504589_n.jpg',
  '/images/hero/487829194_973316954930665_4562441780824404513_n.jpg',
  '/images/hero/497456511_1003714998557527_4566538180681795331_n.jpg',
  '/images/hero/473244639_916040467324981_4289714018005582543_n.jpg',
  '/images/hero/475273815_925388186390209_6029203050592565192_n.jpg',
  '/images/hero/480212000_938663148396046_202826792728334589_n.jpg',
  '/images/hero/475228815_925382479724113_2499542615980911703_n.jpg',
  '/images/hero/496336276_1003446971917663_7756196821473591217_n.jpg',
  '/images/hero/476116942_930079059254455_6769795923910721014_n.jpg',
  '/images/hero/475141197_925387113056983_191848580246898844_n.jpg',
  '/images/hero/479662700_938663391729355_4691970045110290566_n.jpg',
  '/images/hero/497855074_1003714855224208_1298624942372036543_n.jpg',
  '/images/hero/473616891_916040450658316_2760326183573005006_n.jpg',
  '/images/hero/481953339_615971398059034_8298866293451946615_n.jpg',
  '/images/hero/475769049_929543779307983_5639585453440535643_n.jpg',
  '/images/hero/475286661_925383536390674_2776853367171219601_n.jpg',
];

const sections = [
  {
    icon: <IoBookOutline />,
    title: 'Our History',
    desc: 'The extraordinary journey from a jungle clearing to a magnificent temple complex.',
    href: '/history',
    color: 'var(--sacred-gold)',
  },
  {
    icon: <GiTempleGate />,
    title: 'Milestones',
    desc: 'A pictorial timeline of key achievements and sacred moments.',
    href: '/milestones',
    color: 'var(--saffron-amber)',
  },
  {
    icon: <IoCalendarOutline />,
    title: 'Events',
    desc: 'Upcoming ceremonies, Pirith chanting, Vesak celebrations, and more.',
    href: '/events',
    color: 'var(--vermillion-temple)',
  },
  {
    icon: <IoHeartOutline />,
    title: 'Blessings',
    desc: 'Messages of blessing and greetings from revered individuals.',
    href: '/blessings',
    color: 'var(--sacred-gold-dark)',
  },
  {
    icon: <IoPeopleOutline />,
    title: 'Acknowledgments',
    desc: 'Gratitude to the donors, workforce, and volunteers who made this possible.',
    href: '/acknowledgments',
    color: 'var(--stone-charcoal)',
  },
  {
    icon: <GiMeditation />,
    title: 'About',
    desc: 'Learn more about the Buddhist Brotherhood Society and our mission.',
    href: '/about',
    color: 'var(--sacred-gold)',
  },
];

const stats = [
  { value: '10m', label: 'Stupa Height', icon: <GiLotusFlower /> },
  { value: '5,000', label: 'Sq.Ft Main Hall', icon: <GiTempleGate /> },
  { value: '4,000+', label: 'Buddhist Students', icon: <IoPeopleOutline /> },
  { value: '2018', label: 'Established', icon: <IoSparkles /> },
];

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={styles.page}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.slideshow}>
          {heroImages.map((img, i) => (
            <div
              key={i}
              className={`${styles.slide} ${i === currentSlide ? styles.activeSlide : ''}`}
              style={{ backgroundImage: `url(${img})` }}
            />
          ))}
          <div className={styles.heroOverlay} />
        </div>

        <motion.div
          className={styles.heroContent}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <div className={styles.heroLotus}>
            <GiLotusFlower />
          </div>
          <h1 className={styles.heroTitle}>
            Sarasavi Viharaya
          </h1>
          <p className={styles.heroSubtitle}>
            Buddhist Temple of the University of Jaffna
          </p>
          <p className={styles.heroDesc}>
            A sacred sanctuary of peace, wisdom, and cultural harmony — built with the unwavering devotion of university students on the Kilinochchi premises.
          </p>
          <div className={styles.heroBtns}>
            <Link href="/history" className="btn btn-primary">
              Discover Our Journey <IoArrowForward />
            </Link>
            <Link href="/events" className="btn btn-secondary">
              Explore Events
            </Link>
          </div>

          <div className={styles.slideIndicators}>
            {heroImages.map((_, i) => (
              <button
                key={i}
                className={`${styles.indicator} ${i === currentSlide ? styles.indicatorActive : ''}`}
                onClick={() => setCurrentSlide(i)}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className={styles.statsSection}>
        <div className={`container ${styles.statsGrid}`}>
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              className={styles.statCard}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <span className={styles.statIcon}>{stat.icon}</span>
              <span className={styles.statValue}>{stat.value}</span>
              <span className={styles.statLabel}>{stat.label}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Sections Grid */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2>Explore Sarasavi Viharaya</h2>
            <p>Discover the spiritual heart of the University of Jaffna through our rich history, events, and community.</p>
          </div>

          <div className={styles.sectionsGrid}>
            {sections.map((section, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link href={section.href} className={styles.sectionCard}>
                  <span className={styles.sectionIcon} style={{ color: section.color }}>
                    {section.icon}
                  </span>
                  <h3>{section.title}</h3>
                  <p>{section.desc}</p>
                  <span className={styles.sectionArrow}>
                    <IoArrowForward />
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className={styles.quoteSection}>
        <div className="container container-sm">
          <motion.div
            className={styles.quoteCard}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <GiLotusFlower className={styles.quoteIcon} />
            <blockquote className={styles.quote}>
              &ldquo;All that we are is the result of what we have thought: it is founded on our thoughts and made up of our thoughts.&rdquo;
            </blockquote>
            <cite className={styles.quoteCite}>— Lord Buddha</cite>
          </motion.div>
        </div>
      </section>

      {/* Subscribe Section */}
      <section className="section">
        <div className="container container-sm">
          <SubscribeForm />
        </div>
      </section>
    </div>
  );
}
