'use client';

import { useState, useEffect, useCallback } from 'react';
import {
    signInWithEmailAndPassword,
    signOut as firebaseSignOut,
    onAuthStateChanged,
    User,
} from 'firebase/auth';
import { auth } from './firebase';
import { getUser } from './firestore';
import type { AppUser } from '@/types';

export async function signIn(email: string, password: string) {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    return cred.user;
}

export async function signOut() {
    await firebaseSignOut(auth);
}

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [appUser, setAppUser] = useState<AppUser | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
            setUser(firebaseUser);
            if (firebaseUser) {
                try {
                    const userData = await getUser(firebaseUser.uid);
                    setAppUser(userData);
                } catch {
                    setAppUser(null);
                }
            } else {
                setAppUser(null);
            }
            setLoading(false);
        });
        return () => unsub();
    }, []);

    const logout = useCallback(async () => {
        await signOut();
        setUser(null);
        setAppUser(null);
    }, []);

    return { user, appUser, loading, logout };
}

// Role hierarchy checks
export function canManageUsers(role: string): boolean {
    return role === 'super_admin' || role === 'admin';
}

export function canManageContent(role: string): boolean {
    return role === 'super_admin' || role === 'admin' || role === 'moderator';
}

export function isSuperAdmin(role: string): boolean {
    return role === 'super_admin';
}
