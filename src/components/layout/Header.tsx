'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { IoMenu, IoClose } from 'react-icons/io5';
import { GiLotus } from 'react-icons/gi';
import styles from './Header.module.css';

const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/history', label: 'History' },
    { href: '/milestones', label: 'Milestones' },
    { href: '/events', label: 'Events' },
    { href: '/blessings', label: 'Blessings' },
    { href: '/acknowledgments', label: 'Acknowledgments' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
];

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    return (
        <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
            <div className={styles.container}>
                <Link href="/" className={styles.logo}>
                    <GiLotus className={styles.logoIcon} />
                    <div className={styles.logoText}>
                        <span className={styles.logoTitle}>Sarasavi Viharaya</span>
                        <span className={styles.logoSubtitle}>University of Jaffna</span>
                    </div>
                </Link>

                <nav className={`${styles.nav} ${isOpen ? styles.navOpen : ''}`}>
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`${styles.navLink} ${pathname === link.href ? styles.active : ''}`}
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                <button
                    className={styles.menuBtn}
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label="Toggle menu"
                >
                    {isOpen ? <IoClose /> : <IoMenu />}
                </button>
            </div>
        </header>
    );
}
