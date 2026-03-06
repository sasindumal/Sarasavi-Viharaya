'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { GiLotusFlower } from 'react-icons/gi';
import styles from './TempleGateLaunch.module.css';

interface TempleGateLaunchProps {
    chiefGuestName?: string;
    chiefGuestTitle?: string;
    ceremonyDate?: string;
    onLaunchComplete?: () => void;
}

export default function TempleGateLaunch({
    chiefGuestName = 'Distinguished Chief Guest',
    chiefGuestTitle = '',
    ceremonyDate,
    onLaunchComplete,
}: TempleGateLaunchProps) {
    const searchParams = useSearchParams();
    const [isOpened, setIsOpened] = useState(false);
    const [isHidden, setIsHidden] = useState(false);
    const [isLaunched, setIsLaunched] = useState(false);

    // Check for ?launch=reset to re-show the gates
    useEffect(() => {
        if (typeof window !== 'undefined' && searchParams.get('launch') === 'reset') {
            localStorage.removeItem('sarasavi-launched');
            setIsLaunched(false);
            setIsHidden(false);
            setIsOpened(false);
            // Clean the URL by removing the query param
            window.history.replaceState({}, '', window.location.pathname);
        }
    }, [searchParams]);

    // Check localStorage on mount
    useEffect(() => {
        if (typeof window !== 'undefined') {
            // Skip if we just reset
            if (searchParams.get('launch') === 'reset') return;
            const launched = localStorage.getItem('sarasavi-launched');
            if (launched === 'true') {
                setIsLaunched(true);
                setIsHidden(true);
            }
        }
    }, [searchParams]);

    const handleLaunch = useCallback(() => {
        if (isOpened) return;
        setIsOpened(true);

        // After gates finish opening, fade out overlay
        setTimeout(() => {
            setIsHidden(true);
            localStorage.setItem('sarasavi-launched', 'true');
            if (onLaunchComplete) onLaunchComplete();
        }, 3500);
    }, [isOpened, onLaunchComplete]);

    // Generate light rays
    const lightRays = useMemo(() => {
        return Array.from({ length: 16 }, (_, i) => {
            const angle = (360 / 16) * i;
            return (
                <div
                    key={`ray-${i}`}
                    className={styles.lightRay}
                    style={{
                        transform: `rotate(${angle}deg)`,
                        opacity: 0.3 + Math.random() * 0.4,
                        height: `${40 + Math.random() * 20}%`,
                    }}
                />
            );
        });
    }, []);

    // Generate burst particles
    const particles = useMemo(() => {
        return Array.from({ length: 40 }, (_, i) => {
            const angle = Math.random() * 360;
            const distance = 100 + Math.random() * 400;
            const x = Math.cos((angle * Math.PI) / 180) * distance;
            const y = Math.sin((angle * Math.PI) / 180) * distance;
            const size = 3 + Math.random() * 8;
            const delay = Math.random() * 0.8;

            return (
                <div
                    key={`p-${i}`}
                    className={styles.particle}
                    style={{
                        width: `${size}px`,
                        height: `${size}px`,
                        top: '50%',
                        left: '50%',
                        animationDelay: `${delay}s`,
                        '--particle-end': `translate(${x}px, ${y}px)`,
                    } as React.CSSProperties}
                />
            );
        });
    }, []);

    // Generate ambient dust particles
    const dustParticles = useMemo(() => {
        return Array.from({ length: 20 }, (_, i) => (
            <div
                key={`dust-${i}`}
                className={styles.dustParticle}
                style={{
                    left: `${Math.random() * 100}%`,
                    animationDuration: `${8 + Math.random() * 12}s`,
                    animationDelay: `${Math.random() * 10}s`,
                    width: `${1 + Math.random() * 3}px`,
                    height: `${1 + Math.random() * 3}px`,
                }}
            />
        ));
    }, []);

    // Carving decorative lines (horizontal lines on gates)
    const carvingLines = useMemo(() => {
        const positions = [25, 45, 55, 75];
        return positions.map((pos, i) => (
            <div
                key={`line-${i}`}
                className={styles.carvingLine}
                style={{ top: `${pos}%` }}
            />
        ));
    }, []);

    // Don't render at all if already launched
    if (isLaunched && isHidden) return null;

    const overlayClass = [
        styles.overlay,
        isOpened ? styles.opened : '',
        isHidden ? styles.hidden : '',
    ]
        .filter(Boolean)
        .join(' ');

    const formattedDate = ceremonyDate || new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <div className={overlayClass} id="temple-gate-launch">
            {/* Ambient background */}
            <div className={styles.ambientGlow} />
            {dustParticles}

            {/* Decorative arc at top */}
            <div className={styles.decorativeArc} />

            {/* Gate doors */}
            <div className={styles.gateContainer}>
                {/* Left gate door */}
                <div className={styles.gateLeft}>
                    <div className={styles.gateBorderOuter} />
                    <div className={styles.gateBorderInner} />

                    {/* Corner ornaments */}
                    <div className={`${styles.cornerOrnament} ${styles.topLeft}`} />
                    <div className={`${styles.cornerOrnament} ${styles.bottomLeft}`} />

                    {/* Vertical decorative strips */}
                    <div className={styles.verticalStrip} />
                    <div className={styles.verticalStrip} />

                    {/* Carving — Dharma wheel */}
                    <div className={styles.carvingTop}>
                        <div className={styles.carvingDharmaWheel} />
                    </div>

                    {/* Lotus carving */}
                    <div className={styles.carvingLotus}>❀</div>

                    {/* Horizontal carving lines */}
                    {carvingLines}

                    {/* Stupa silhouette */}
                    <div className={styles.stupaCarving} />

                    {/* Gate handle ring */}
                    <div className={styles.gateHandle} />
                </div>

                {/* Right gate door */}
                <div className={styles.gateRight}>
                    <div className={styles.gateBorderOuter} />
                    <div className={styles.gateBorderInner} />

                    {/* Corner ornaments */}
                    <div className={`${styles.cornerOrnament} ${styles.topRight}`} />
                    <div className={`${styles.cornerOrnament} ${styles.bottomRight}`} />

                    {/* Vertical decorative strips */}
                    <div className={styles.verticalStrip} />
                    <div className={styles.verticalStrip} />

                    {/* Carving — Dharma wheel */}
                    <div className={styles.carvingTop}>
                        <div className={styles.carvingDharmaWheel} />
                    </div>

                    {/* Lotus carving */}
                    <div className={styles.carvingLotus}>❀</div>

                    {/* Horizontal carving lines */}
                    {carvingLines}

                    {/* Stupa silhouette */}
                    <div className={styles.stupaCarving} />

                    {/* Gate handle ring */}
                    <div className={styles.gateHandle} />
                </div>
            </div>

            {/* Light rays (burst on open) */}
            <div className={styles.lightRays}>{lightRays}</div>

            {/* Golden particles burst */}
            <div className={styles.particles}>{particles}</div>

            {/* Center content — above the gates */}
            <div className={styles.centerContent}>
                <span className={styles.ceremonyLabel}>
                    Official Website Launch
                </span>

                <div className={styles.lotusSymbol}>
                    <GiLotusFlower />
                </div>

                <h1 className={styles.title}>Sarasavi Viharaya</h1>
                <p className={styles.sinhalaTitle}>සරසවි විහාරය</p>

                <div className={styles.goldDivider} />

                <div className={styles.chiefGuestSection}>
                    <p className={styles.chiefGuestLabel}>Launched by</p>
                    <h2 className={styles.chiefGuestName}>{chiefGuestName}</h2>
                    {chiefGuestTitle && (
                        <p className={styles.chiefGuestTitle}>{chiefGuestTitle}</p>
                    )}
                </div>

                {!isOpened && (
                    <div className={styles.launchBtnWrapper}>
                        <button
                            className={styles.launchBtn}
                            onClick={handleLaunch}
                            id="launch-button"
                        >
                            Open the Sacred Gates
                        </button>
                        <div className={styles.pulseRing} />
                        <div className={styles.pulseRing} />
                        <div className={styles.pulseRing} />
                    </div>
                )}
            </div>

            {/* Bottom date */}
            <div className={styles.bottomText}>
                <p className={styles.dateText}>{formattedDate}</p>
            </div>
        </div>
    );
}
