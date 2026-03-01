'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { IoCalendarOutline, IoTimeOutline, IoLocationOutline, IoSparkles, IoArrowForward, IoLeafOutline, IoBookOutline, IoPeopleOutline, IoHeartOutline, IoMailOutline } from 'react-icons/io5';
import SubscribeForm from '@/components/ui/SubscribeForm';
import { GiLotusFlower, GiTempleGate, GiMeditation } from 'react-icons/gi';
import styles from './page.module.css';

const heroImages = [
  '/images/hero/temple-stupa-golden-hour.png',
  '/images/hero/temple-hall-sunset.png',
  '/images/hero/stupa-blue-hour.png',
  '/images/hero/temple-aerial-view.png',
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
    }, 6000);
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
              &ldquo;Thousands of candles can be lighted from a single candle, and the life of the candle will not be shortened. Happiness never decreases by being shared.&rdquo;
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
