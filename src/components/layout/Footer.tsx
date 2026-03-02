import React from 'react';
import Link from 'next/link';
import { GiLotus } from 'react-icons/gi';
import { IoLogoYoutube, IoLogoFacebook, IoMail, IoCall } from 'react-icons/io5';
import styles from './Footer.module.css';

export default function Footer() {
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

                    <div className={styles.links}>
                        <h4>Explore</h4>
                        <ul>
                            <li><Link href="/history">Our History</Link></li>
                            <li><Link href="/milestones">Milestones</Link></li>
                            <li><Link href="/events">Events</Link></li>
                            <li><Link href="/blessings">Blessings</Link></li>
                            <li><Link href="/acknowledgments">Acknowledgments</Link></li>
                        </ul>
                    </div>

                    <div className={styles.links}>
                        <h4>Quick Links</h4>
                        <ul>
                            <li><Link href="/about">About</Link></li>
                            <li><Link href="/contact">Contact Us</Link></li>
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
