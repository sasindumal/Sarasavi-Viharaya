'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface GlassCardProps {
    children: React.ReactNode;
    className?: string;
    hover?: boolean;
    delay?: number;
    padding?: string;
    onClick?: () => void;
}

export default function GlassCard({ children, className = '', hover = true, delay = 0, padding, onClick }: GlassCardProps) {
    return (
        <motion.div
            className={`glass-card ${className}`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay }}
            whileHover={hover ? { y: -4, boxShadow: '0 12px 40px rgba(26,25,25,0.12), 0 4px 12px rgba(26,25,25,0.06)' } : undefined}
            style={padding ? { padding } : undefined}
            onClick={onClick}
        >
            {children}
        </motion.div>
    );
}
