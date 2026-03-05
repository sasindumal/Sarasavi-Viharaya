import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

export async function POST(request: Request) {
    try {
        const { milestones } = await request.json();
        const results = [];

        for (const ms of milestones) {
            const now = new Date().toISOString();
            const docRef = await addDoc(collection(db, 'milestones'), {
                title: ms.title,
                description: ms.description,
                date: ms.date,
                endDate: ms.endDate || '',
                duration: ms.duration || '',
                coverPhoto: ms.coverPhoto || '',
                photos: ms.photos || [],
                notifySubscribers: false,
                isPublished: true,
                createdAt: now,
                updatedAt: now,
                createdBy: 'seed-script',
            });
            results.push({ id: docRef.id, title: ms.title });
        }

        return NextResponse.json({ success: true, count: results.length, results });
    } catch (error) {
        console.error('Seed error:', error);
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}
