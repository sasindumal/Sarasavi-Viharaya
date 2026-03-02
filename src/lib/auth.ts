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

// Role hierarchy: super_admin > admin > moderator
const ROLE_LEVEL: Record<string, number> = {
    super_admin: 3,
    admin: 2,
    moderator: 1,
};

export function getRoleLevel(role: string): number {
    return ROLE_LEVEL[role] || 0;
}

// Can this role manage users at all? (super_admin and admin only)
export function canManageUsers(role: string): boolean {
    return role === 'super_admin' || role === 'admin';
}

// Can this role manage content? (all roles)
export function canManageContent(role: string): boolean {
    return role === 'super_admin' || role === 'admin' || role === 'moderator';
}

export function isSuperAdmin(role: string): boolean {
    return role === 'super_admin';
}

// Can the actor manage a target user with the given role?
// super_admin can manage admin & moderator; admin can manage moderator only
export function canManageRole(actorRole: string, targetRole: string): boolean {
    return getRoleLevel(actorRole) > getRoleLevel(targetRole);
}

// What roles can this actor assign?
export function getAssignableRoles(actorRole: string): Array<'admin' | 'moderator'> {
    if (actorRole === 'super_admin') return ['admin', 'moderator'];
    if (actorRole === 'admin') return ['moderator'];
    return [];
}
