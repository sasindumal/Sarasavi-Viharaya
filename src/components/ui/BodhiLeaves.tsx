'use client';

import React from 'react';
import styles from './BodhiLeaves.module.css';

export default function BodhiLeaves() {
    const leaves = Array.from({ length: 15 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 20,
        duration: 15 + Math.random() * 20,
        size: 12 + Math.random() * 18,
        opacity: 0.15 + Math.random() * 0.25,
    }));

    return (
        <div className={styles.container} aria-hidden="true">
            {leaves.map((leaf) => (
                <div
                    key={leaf.id}
                    className={styles.leaf}
                    style={{
                        left: `${leaf.left}%`,
                        animationDelay: `${leaf.delay}s`,
                        animationDuration: `${leaf.duration}s`,
                        fontSize: `${leaf.size}px`,
                        opacity: leaf.opacity,
                    }}
                >
                    <svg viewBox="0 0 40 60" width="1em" height="1.5em" fill="currentColor">
                        <path d="M20 2 C15 12 5 27 5 42 C5 52 12 58 20 58 C28 58 35 52 35 42 C35 27 25 12 20 2Z" />
                        <line x1="20" y1="8" x2="20" y2="52" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
                        <line x1="20" y1="20" x2="10" y2="35" stroke="rgba(255,255,255,0.2)" strokeWidth="0.3" />
                        <line x1="20" y1="20" x2="30" y2="35" stroke="rgba(255,255,255,0.2)" strokeWidth="0.3" />
                        <line x1="20" y1="30" x2="12" y2="42" stroke="rgba(255,255,255,0.2)" strokeWidth="0.3" />
                        <line x1="20" y1="30" x2="28" y2="42" stroke="rgba(255,255,255,0.2)" strokeWidth="0.3" />
                    </svg>
                </div>
            ))}
        </div>
    );
}
