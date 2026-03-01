'use client';

import React, { useState, useCallback } from 'react';
import styles from './PhotoAlbum.module.css';
import { IoClose, IoChevronBack, IoChevronForward } from 'react-icons/io5';

interface PhotoAlbumProps {
    photos: string[];
    coverPhoto?: string;
}

export default function PhotoAlbum({ photos, coverPhoto }: PhotoAlbumProps) {
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

    const allPhotos = coverPhoto ? [coverPhoto, ...photos.filter(p => p !== coverPhoto)] : photos;

    const openLightbox = useCallback((index: number) => setLightboxIndex(index), []);
    const closeLightbox = useCallback(() => setLightboxIndex(null), []);
    const nextPhoto = useCallback(() => {
        if (lightboxIndex !== null) setLightboxIndex((lightboxIndex + 1) % allPhotos.length);
    }, [lightboxIndex, allPhotos.length]);
    const prevPhoto = useCallback(() => {
        if (lightboxIndex !== null) setLightboxIndex((lightboxIndex - 1 + allPhotos.length) % allPhotos.length);
    }, [lightboxIndex, allPhotos.length]);

    if (allPhotos.length === 0) {
        return <div className={styles.empty}>No photos yet</div>;
    }

    return (
        <>
            <div className={styles.grid}>
                {allPhotos.map((photo, i) => (
                    <div
                        key={i}
                        className={`${styles.photoWrapper} ${i === 0 && coverPhoto ? styles.coverWrapper : ''}`}
                        onClick={() => openLightbox(i)}
                    >
                        <img src={photo} alt={`Photo ${i + 1}`} className={styles.photo} loading="lazy" />
                        {i === 0 && coverPhoto && <span className={styles.coverBadge}>Cover</span>}
                        <div className={styles.photoOverlay}>
                            <span>View</span>
                        </div>
                    </div>
                ))}
            </div>

            {lightboxIndex !== null && (
                <div className={styles.lightbox} onClick={closeLightbox}>
                    <button className={styles.closeBtn} onClick={closeLightbox}><IoClose /></button>
                    <button className={styles.navBtn} style={{ left: '1rem' }} onClick={(e) => { e.stopPropagation(); prevPhoto(); }}><IoChevronBack /></button>
                    <img
                        src={allPhotos[lightboxIndex]}
                        alt={`Photo ${lightboxIndex + 1}`}
                        className={styles.lightboxImage}
                        onClick={(e) => e.stopPropagation()}
                    />
                    <button className={styles.navBtn} style={{ right: '1rem' }} onClick={(e) => { e.stopPropagation(); nextPhoto(); }}><IoChevronForward /></button>
                    <div className={styles.counter}>{lightboxIndex + 1} / {allPhotos.length}</div>
                </div>
            )}
        </>
    );
}
