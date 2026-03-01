'use client';

import React from 'react';

interface TagChipProps {
    label: string;
    active?: boolean;
    onClick?: () => void;
    removable?: boolean;
    onRemove?: () => void;
}

const chipStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '0.35rem 0.9rem',
    borderRadius: '9999px',
    fontSize: '0.8rem',
    fontWeight: 600,
    letterSpacing: '0.03em',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    border: '1px solid rgba(245, 185, 38, 0.3)',
    background: 'linear-gradient(135deg, rgba(245,185,38,0.1), rgba(237,159,45,0.1))',
    color: '#d9a01e',
};

const chipActiveStyle: React.CSSProperties = {
    ...chipStyle,
    background: 'linear-gradient(135deg, #F5B926, #ED9F2D)',
    color: '#1A1919',
    border: '1px solid #F5B926',
    boxShadow: '0 2px 8px rgba(245, 185, 38, 0.3)',
};

const removeStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '16px',
    height: '16px',
    borderRadius: '50%',
    background: 'rgba(223, 82, 42, 0.15)',
    color: '#DF522A',
    fontSize: '0.7rem',
    border: 'none',
    cursor: 'pointer',
    lineHeight: 1,
    padding: 0,
};

export default function TagChip({ label, active = false, onClick, removable = false, onRemove }: TagChipProps) {
    return (
        <span
            style={active ? chipActiveStyle : chipStyle}
            onClick={onClick}
            role={onClick ? 'button' : undefined}
            tabIndex={onClick ? 0 : undefined}
        >
            {label}
            {removable && onRemove && (
                <button
                    style={removeStyle}
                    onClick={(e) => { e.stopPropagation(); onRemove(); }}
                    aria-label={`Remove ${label}`}
                >
                    ×
                </button>
            )}
        </span>
    );
}
