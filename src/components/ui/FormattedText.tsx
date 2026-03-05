'use client';

import React from 'react';

interface FormattedTextProps {
    text: string;
    className?: string;
}

/**
 * Renders text with proper paragraph breaks and preserved newlines.
 * - Empty lines create separate paragraphs
 * - Single newlines within paragraphs are preserved via white-space: pre-line
 */
export default function FormattedText({ text, className }: FormattedTextProps) {
    if (!text) return null;

    // Split on double newlines (or more) to create paragraphs
    const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim());

    // If only one paragraph (no double newlines), just render with pre-line
    if (paragraphs.length <= 1) {
        return (
            <p className={className} style={{ whiteSpace: 'pre-line' }}>
                {text.trim()}
            </p>
        );
    }

    // Multiple paragraphs — render each as a separate <p> with pre-line
    return (
        <div className="formatted-text">
            {paragraphs.map((para, i) => (
                <p key={i} className={className} style={{ whiteSpace: 'pre-line' }}>
                    {para.trim()}
                </p>
            ))}
        </div>
    );
}
