'use client';

import React, { useState, useEffect } from 'react';
import { differenceInDays, differenceInHours, differenceInMinutes, differenceInSeconds } from 'date-fns';
import styles from './CountdownTimer.module.css';

interface CountdownTimerProps {
    targetDate: string;
    compact?: boolean;
}

interface TimeLeft {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

export default function CountdownTimer({ targetDate, compact = false }: CountdownTimerProps) {
    const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const [isExpired, setIsExpired] = useState(false);

    useEffect(() => {
        const target = new Date(targetDate);

        const calculateTimeLeft = () => {
            const now = new Date();
            if (target <= now) {
                setIsExpired(true);
                return;
            }

            const days = differenceInDays(target, now);
            const hours = differenceInHours(target, now) % 24;
            const minutes = differenceInMinutes(target, now) % 60;
            const seconds = differenceInSeconds(target, now) % 60;

            setTimeLeft({ days, hours, minutes, seconds });
        };

        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 1000);
        return () => clearInterval(timer);
    }, [targetDate]);

    if (isExpired) {
        return <span className={styles.expired}>Event has started</span>;
    }

    if (compact) {
        return (
            <div className={styles.compact}>
                <span>{timeLeft.days}d</span>
                <span>{timeLeft.hours}h</span>
                <span>{timeLeft.minutes}m</span>
            </div>
        );
    }

    return (
        <div className={styles.countdown}>
            <div className={styles.unit}>
                <span className={styles.number}>{String(timeLeft.days).padStart(2, '0')}</span>
                <span className={styles.label}>Days</span>
            </div>
            <span className={styles.separator}>:</span>
            <div className={styles.unit}>
                <span className={styles.number}>{String(timeLeft.hours).padStart(2, '0')}</span>
                <span className={styles.label}>Hours</span>
            </div>
            <span className={styles.separator}>:</span>
            <div className={styles.unit}>
                <span className={styles.number}>{String(timeLeft.minutes).padStart(2, '0')}</span>
                <span className={styles.label}>Minutes</span>
            </div>
            <span className={styles.separator}>:</span>
            <div className={styles.unit}>
                <span className={styles.number}>{String(timeLeft.seconds).padStart(2, '0')}</span>
                <span className={styles.label}>Seconds</span>
            </div>
        </div>
    );
}
