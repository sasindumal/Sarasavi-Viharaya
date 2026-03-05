'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { GiLotus } from 'react-icons/gi';
import { IoLogoYoutube, IoLogoFacebook, IoMail, IoCall } from 'react-icons/io5';
import { getPageVisibility } from '@/lib/firestore';
import type { PageConfig } from '@/types';
import styles from './Footer.module.css';

const exploreLinks = [
    { href: '/history', label: 'Our History' },
    { href: '/milestones', label: 'Milestones' },
    { href: '/events', label: 'Events' },
    { href: '/blessings', label: 'Blessings' },
    { href: '/acknowledgments', label: 'Acknowledgments' },
];

const quickLinks = [
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact Us' },
];

export default function Footer() {
    const [visibleExploreSlugs, setVisibleExploreSlugs] = useState<Set<string>>(
        new Set(exploreLinks.map(l => l.href))
    );
    const [visibleQuickSlugs, setVisibleQuickSlugs] = useState<Set<string>>(
        new Set(quickLinks.map(l => l.href))
    );

    useEffect(() => {
        async function loadVisibility() {
            try {
                const config = await getPageVisibility();
                const footerSlugs = new Set(
                    config.pages
                        .filter((p: PageConfig) => p.showInFooter)
                        .map((p: PageConfig) => p.slug)
                );
                setVisibleExploreSlugs(footerSlugs);
                setVisibleQuickSlugs(footerSlugs);
            } catch {
                // On error keep all links shown
            }
        }
        loadVisibility();
    }, []);

    const filteredExplore = exploreLinks.filter(l => visibleExploreSlugs.has(l.href));
    const filteredQuick = quickLinks.filter(l => visibleQuickSlugs.has(l.href));

    return (
        <footer className={styles.footer}>
            <div className={styles.decorBorder}></div>
            <div className={styles.container}>
                <div className={styles.grid}>
                    <div className={styles.brand}>
                        <div className={styles.logo}>
                            <GiLotus className={styles.logoIcon} />
                            <div>
                                <h3 className={styles.logoTitle}>Sarasavi Viharaya</h3>
                                <p className={styles.logoSub}>Buddhist Temple of University of Jaffna</p>
                            </div>
                        </div>
                        <p className={styles.description}>
                            A sacred place of spiritual peace and cultural harmony, built with the dedication of university students.
                        </p>
                    </div>

                    {filteredExplore.length > 0 && (
                        <div className={styles.links}>
                            <h4>Explore</h4>
                            <ul>
                                {filteredExplore.map(link => (
                                    <li key={link.href}><Link href={link.href}>{link.label}</Link></li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <div className={styles.links}>
                        <h4>Quick Links</h4>
                        <ul>
                            {filteredQuick.map(link => (
                                <li key={link.href}><Link href={link.href}>{link.label}</Link></li>
                            ))}
                            <li><Link href="/admin/login">Admin Portal</Link></li>
                        </ul>
                    </div>

                    <div className={styles.social}>
                        <h4>Connect With Us</h4>
                        <div className={styles.socialLinks}>
                            <a href="https://www.youtube.com/@thalaranedamsaknada4502" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="YouTube">
                                <IoLogoYoutube />
                            </a>
                            <a href="https://web.facebook.com/JaffnaUniYMBA" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="Facebook">
                                <IoLogoFacebook />
                            </a>
                            <a href="mailto:thalaranedamsaknada@gmail.com" className={styles.socialIcon} aria-label="Email">
                                <IoMail />
                            </a>
                            <a href="tel:+94776993908" className={styles.socialIcon} aria-label="Phone">
                                <IoCall />
                            </a>
                        </div>
                    </div>
                </div>

                <div className={styles.bottom}>
                    <p>© {new Date().getFullYear()} Sarasavi Viharaya — University of Jaffna. Built with devotion.</p>
                    <p className={styles.quote}>සබ්බ දානං ධම්ම දානං ජිනාති — The Gift of Dhamma excels all other gifts</p>
                </div>
            </div>
        </footer>
    );
}
