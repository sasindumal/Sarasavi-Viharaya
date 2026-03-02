import {
    collection,
    doc,
    getDocs,
    getDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    Timestamp,
    setDoc,
} from 'firebase/firestore';
import { db } from './firebase';
import type { Event, Milestone, Tag, AppUser, Subscriber, ContactMessage, BlessingMessage, Acknowledgment } from '@/types';

// ==================== EVENTS ====================

export async function getEvents(): Promise<Event[]> {
    const q = query(collection(db, 'events'), orderBy('date', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Event));
}

export async function getEvent(id: string): Promise<Event | null> {
    const docRef = doc(db, 'events', id);
    const snapshot = await getDoc(docRef);
    if (!snapshot.exists()) return null;
    return { id: snapshot.id, ...snapshot.data() } as Event;
}

export async function createEvent(data: Omit<Event, 'id'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'events'), data);
    return docRef.id;
}

export async function updateEvent(id: string, data: Partial<Event>): Promise<void> {
    await updateDoc(doc(db, 'events', id), data as Record<string, unknown>);
}

export async function deleteEvent(id: string): Promise<void> {
    await deleteDoc(doc(db, 'events', id));
}

// ==================== MILESTONES ====================

export async function getMilestones(): Promise<Milestone[]> {
    const q = query(collection(db, 'milestones'), orderBy('date', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Milestone));
}

export async function getMilestone(id: string): Promise<Milestone | null> {
    const docRef = doc(db, 'milestones', id);
    const snapshot = await getDoc(docRef);
    if (!snapshot.exists()) return null;
    return { id: snapshot.id, ...snapshot.data() } as Milestone;
}

export async function createMilestone(data: Omit<Milestone, 'id'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'milestones'), data);
    return docRef.id;
}

export async function updateMilestone(id: string, data: Partial<Milestone>): Promise<void> {
    await updateDoc(doc(db, 'milestones', id), data as Record<string, unknown>);
}

export async function deleteMilestone(id: string): Promise<void> {
    await deleteDoc(doc(db, 'milestones', id));
}

// ==================== TAGS ====================

export async function getTags(): Promise<Tag[]> {
    const q = query(collection(db, 'tags'), orderBy('name', 'asc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Tag));
}

export async function createTag(name: string): Promise<string> {
    const docRef = await addDoc(collection(db, 'tags'), {
        name,
        createdAt: new Date().toISOString(),
    });
    return docRef.id;
}

export async function deleteTag(id: string): Promise<void> {
    await deleteDoc(doc(db, 'tags', id));
}

// ==================== USERS ====================

export async function getUsers(): Promise<AppUser[]> {
    const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => ({ uid: d.id, ...d.data() } as AppUser));
}

export async function getUser(uid: string): Promise<AppUser | null> {
    const docRef = doc(db, 'users', uid);
    const snapshot = await getDoc(docRef);
    if (!snapshot.exists()) return null;
    return { uid: snapshot.id, ...snapshot.data() } as AppUser;
}

export async function setUser(uid: string, data: Omit<AppUser, 'uid'>): Promise<void> {
    await setDoc(doc(db, 'users', uid), data);
}

export async function deleteUser(uid: string): Promise<void> {
    await deleteDoc(doc(db, 'users', uid));
}

// ==================== SUBSCRIBERS ====================

export async function getSubscribers(): Promise<Subscriber[]> {
    const q = query(collection(db, 'subscribers'), where('isActive', '==', true));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Subscriber));
}

export async function addSubscriber(email: string, name?: string): Promise<string> {
    const q = query(collection(db, 'subscribers'), where('email', '==', email));
    const existing = await getDocs(q);
    if (!existing.empty) {
        const existingDoc = existing.docs[0];
        await updateDoc(doc(db, 'subscribers', existingDoc.id), { isActive: true });
        return existingDoc.id;
    }
    const docRef = await addDoc(collection(db, 'subscribers'), {
        email,
        name: name || '',
        subscribedAt: new Date().toISOString(),
        isActive: true,
    });
    return docRef.id;
}

export async function removeSubscriber(id: string): Promise<void> {
    await updateDoc(doc(db, 'subscribers', id), { isActive: false });
}

// ==================== CONTACT MESSAGES ====================

export async function getContactMessages(): Promise<ContactMessage[]> {
    const q = query(collection(db, 'contactMessages'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as ContactMessage));
}

export async function addContactMessage(data: Omit<ContactMessage, 'id'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'contactMessages'), data);
    return docRef.id;
}

export async function markMessageRead(id: string, isRead: boolean): Promise<void> {
    await updateDoc(doc(db, 'contactMessages', id), { isRead });
}

export async function deleteContactMessage(id: string): Promise<void> {
    await deleteDoc(doc(db, 'contactMessages', id));
}

// ==================== BLESSINGS ====================

export async function getBlessings(): Promise<BlessingMessage[]> {
    const q = query(collection(db, 'blessings'), orderBy('order', 'asc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as BlessingMessage));
}

export async function createBlessing(data: Omit<BlessingMessage, 'id'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'blessings'), data);
    return docRef.id;
}

export async function updateBlessing(id: string, data: Partial<BlessingMessage>): Promise<void> {
    await updateDoc(doc(db, 'blessings', id), data);
}

export async function deleteBlessing(id: string): Promise<void> {
    await deleteDoc(doc(db, 'blessings', id));
}

// ==================== ACKNOWLEDGMENTS ====================

export async function getAcknowledgments(): Promise<Acknowledgment[]> {
    const q = query(collection(db, 'acknowledgments'), orderBy('order', 'asc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Acknowledgment));
}

export async function createAcknowledgment(data: Omit<Acknowledgment, 'id'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'acknowledgments'), data);
    return docRef.id;
}

export async function updateAcknowledgment(id: string, data: Partial<Acknowledgment>): Promise<void> {
    await updateDoc(doc(db, 'acknowledgments', id), data);
}

export async function deleteAcknowledgment(id: string): Promise<void> {
    await deleteDoc(doc(db, 'acknowledgments', id));
}
