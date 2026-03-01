'use client';

import React from 'react';
import { GiLotusFlower } from 'react-icons/gi';

interface LoadingSpinnerProps {
    message?: string;
    size?: 'sm' | 'md' | 'lg';
}

const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '3rem',
    gap: '1rem',
};

const sizeMap = { sm: '1.5rem', md: '2.5rem', lg: '4rem' };

export default function LoadingSpinner({ message = 'Loading...', size = 'md' }: LoadingSpinnerProps) {
    return (
        <div style={containerStyle}>
            <GiLotusFlower
                style={{
                    fontSize: sizeMap[size],
                    color: '#F5B926',
                    animation: 'spin-slow 3s linear infinite',
                }}
            />
            <span style={{
                fontSize: '0.9rem',
                color: '#343534',
                opacity: 0.7,
                fontWeight: 500,
            }}>
                {message}
            </span>
        </div>
    );
}
