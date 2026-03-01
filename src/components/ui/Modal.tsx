'use client';

import React, { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoCloseOutline } from 'react-icons/io5';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    maxWidth?: string;
}

const overlayStyle: React.CSSProperties = {
    position: 'fixed',
    inset: 0,
    background: 'rgba(26, 25, 25, 0.6)',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem',
};

const panelBaseStyle: React.CSSProperties = {
    background: 'rgba(255, 255, 254, 0.95)',
    backdropFilter: 'blur(30px)',
    WebkitBackdropFilter: 'blur(30px)',
    border: '1px solid rgba(245, 185, 38, 0.25)',
    borderRadius: '20px',
    boxShadow: '0 20px 60px rgba(26,25,25,0.15), 0 8px 20px rgba(26,25,25,0.08)',
    width: '100%',
    maxHeight: '90vh',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column' as const,
};

const headerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '1.25rem 1.5rem',
    borderBottom: '1px solid rgba(52,53,52,0.08)',
};

const titleStyle: React.CSSProperties = {
    fontFamily: "'Cinzel', 'Playfair Display', Georgia, serif",
    fontSize: '1.15rem',
    fontWeight: 600,
    color: '#1A1919',
    margin: 0,
};

const closeBtnStyle: React.CSSProperties = {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    border: 'none',
    background: 'rgba(52,53,52,0.06)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    fontSize: '1.3rem',
    color: '#343534',
    transition: 'all 0.2s ease',
};

const bodyStyle: React.CSSProperties = {
    padding: '1.5rem',
    overflowY: 'auto' as const,
    flex: 1,
};

export default function Modal({ isOpen, onClose, title, children, maxWidth = '600px' }: ModalProps) {
    const handleEsc = useCallback((e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
    }, [onClose]);

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('keydown', handleEsc);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = '';
        };
    }, [isOpen, handleEsc]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    style={overlayStyle}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
                >
                    <motion.div
                        style={{ ...panelBaseStyle, maxWidth }}
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.25, ease: [0.34, 1.56, 0.64, 1] }}
                    >
                        <div style={headerStyle}>
                            <h3 style={titleStyle}>{title}</h3>
                            <button style={closeBtnStyle} onClick={onClose} aria-label="Close modal">
                                <IoCloseOutline />
                            </button>
                        </div>
                        <div style={bodyStyle}>
                            {children}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
