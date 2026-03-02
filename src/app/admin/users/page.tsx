'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    IoAddOutline,
    IoTrashOutline,
    IoPeopleOutline,
    IoShieldCheckmarkOutline,
    IoCreateOutline,
} from 'react-icons/io5';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuth, canManageUsers, isSuperAdmin, canManageRole, getAssignableRoles } from '@/lib/auth';
import { getUsers, setUser, deleteUser as fsDeleteUser } from '@/lib/firestore';
import Modal from '@/components/ui/Modal';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import type { AppUser } from '@/types';

const roleColors: Record<string, string> = {
    super_admin: '#DF522A',
    admin: '#F5B926',
    moderator: '#4CAF50',
};

const s: Record<string, React.CSSProperties> = {
    header: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1.5rem',
        flexWrap: 'wrap',
        gap: '1rem',
    },
    title: {
        fontFamily: "'Cinzel', serif",
        fontSize: '1.5rem',
        fontWeight: 700,
        color: '#1A1919',
    },
    card: {
        background: 'rgba(255,255,254,0.75)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(245,185,38,0.12)',
        borderRadius: '16px',
        overflow: 'hidden',
    },
    actions: {
        display: 'flex',
        gap: '0.5rem',
    },
    iconBtn: {
        width: '34px',
        height: '34px',
        borderRadius: '8px',
        border: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        fontSize: '1rem',
        transition: 'all 0.2s ease',
    },
    roleBadge: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: '0.2rem 0.6rem',
        borderRadius: '9999px',
        fontSize: '0.75rem',
        fontWeight: 600,
        textTransform: 'uppercase' as const,
        letterSpacing: '0.04em',
    },
};

export default function AdminUsersPage() {
    const { appUser, loading: authLoading } = useAuth();
    const [users, setUsers] = useState<AppUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({ email: '', password: '', displayName: '', role: 'moderator' as AppUser['role'] });
    const [error, setError] = useState('');
    const [roleEditTarget, setRoleEditTarget] = useState<AppUser | null>(null);
    const [newRole, setNewRole] = useState<AppUser['role']>('moderator');

    useEffect(() => { loadData(); }, []);

    async function loadData() {
        setLoading(true);
        try {
            const u = await getUsers();
            setUsers(u);
        } catch (err) {
            console.error('Error loading users:', err);
        }
        setLoading(false);
    }

    async function handleCreate() {
        if (!form.email || !form.password || !form.displayName) {
            setError('All fields are required');
            return;
        }
        setSaving(true);
        setError('');
        try {
            const cred = await createUserWithEmailAndPassword(auth, form.email, form.password);
            await setUser(cred.user.uid, {
                email: form.email,
                displayName: form.displayName,
                role: form.role,
                createdAt: new Date().toISOString(),
                createdBy: appUser?.uid || '',
            });
            setModalOpen(false);
            setForm({ email: '', password: '', displayName: '', role: 'moderator' });
            await loadData();
        } catch (err) {
            if (err instanceof Error) {
                if (err.message.includes('email-already-in-use')) {
                    setError('This email is already registered.');
                } else if (err.message.includes('weak-password')) {
                    setError('Password must be at least 6 characters.');
                } else {
                    setError(err.message);
                }
            }
        }
        setSaving(false);
    }

    async function handleDelete(uid: string) {
        try {
            await fsDeleteUser(uid);
            setDeleteConfirm(null);
            await loadData();
        } catch (err) {
            console.error('Error deleting user:', err);
        }
    }

    async function handleRoleChange() {
        if (!roleEditTarget || !appUser) return;
        setSaving(true);
        try {
            await setUser(roleEditTarget.uid, {
                email: roleEditTarget.email,
                displayName: roleEditTarget.displayName,
                role: newRole,
                createdAt: roleEditTarget.createdAt,
                createdBy: roleEditTarget.createdBy,
            });
            setRoleEditTarget(null);
            await loadData();
        } catch (err) {
            console.error('Error updating role:', err);
        }
        setSaving(false);
    }

    // Filter visible users: show yourself + users you can manage
    const visibleUsers = users.filter(u => {
        if (!appUser) return false;
        if (u.uid === appUser.uid) return true; // always show self
        return canManageRole(appUser.role, u.role);
    });

    // Determine what roles the current user can assign
    const assignableRoles = appUser ? getAssignableRoles(appUser.role) : [];

    if (authLoading || loading) return <LoadingSpinner message="Loading users..." />;
    if (appUser && !canManageUsers(appUser.role)) {
        return <div style={{ textAlign: 'center', padding: '3rem' }}><h3>Access Denied</h3><p>Only Admins can manage users.</p></div>;
    }

    return (
        <div>
            <div style={s.header}>
                <h1 style={s.title}><IoPeopleOutline style={{ color: '#F5B926' }} /> User Management</h1>
                <button className="btn btn-primary btn-sm" onClick={() => setModalOpen(true)}><IoAddOutline /> New User</button>
            </div>

            <motion.div style={s.card} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Created</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {visibleUsers.length === 0 ? (
                                <tr><td colSpan={5} style={{ textAlign: 'center', padding: '2rem', opacity: 0.5 }}>No users found</td></tr>
                            ) : (
                                visibleUsers.map(u => (
                                    <tr key={u.uid}>
                                        <td style={{ fontWeight: 600 }}>{u.displayName}</td>
                                        <td>{u.email}</td>
                                        <td>
                                            <span style={{
                                                ...s.roleBadge,
                                                background: `${roleColors[u.role]}15`,
                                                color: roleColors[u.role],
                                                border: `1px solid ${roleColors[u.role]}30`,
                                            }}>
                                                <IoShieldCheckmarkOutline /> {u.role.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                                        <td>
                                            <div style={s.actions}>
                                                {u.uid !== appUser?.uid && appUser && canManageRole(appUser.role, u.role) && (
                                                    <>
                                                        <button
                                                            style={{ ...s.iconBtn, background: 'rgba(245,185,38,0.1)', color: '#d9a01e' }}
                                                            onClick={() => { setRoleEditTarget(u); setNewRole(u.role); }}
                                                            title="Change role"
                                                        ><IoCreateOutline /></button>
                                                        <button
                                                            style={{ ...s.iconBtn, background: 'rgba(223,82,42,0.1)', color: '#DF522A' }}
                                                            onClick={() => setDeleteConfirm(u.uid)}
                                                            title="Delete user"
                                                        ><IoTrashOutline /></button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </motion.div>

            {/* Create User Modal */}
            <Modal isOpen={modalOpen} onClose={() => { setModalOpen(false); setError(''); }} title="Create New User" maxWidth="480px">
                <div className="form-group">
                    <label>Display Name *</label>
                    <input className="input-field" value={form.displayName} onChange={e => setForm({ ...form, displayName: e.target.value })} placeholder="Full name" />
                </div>
                <div className="form-group">
                    <label>Email *</label>
                    <input className="input-field" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="admin@example.com" />
                </div>
                <div className="form-group">
                    <label>Password *</label>
                    <input className="input-field" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="Min 6 characters" />
                </div>
                <div className="form-group">
                    <label>Role</label>
                    <select className="input-field" value={form.role} onChange={e => setForm({ ...form, role: e.target.value as AppUser['role'] })}>
                        {assignableRoles.map(r => (
                            <option key={r} value={r}>{r.replace('_', ' ').toUpperCase()}</option>
                        ))}
                    </select>
                </div>
                {error && <p style={{ color: '#DF522A', fontSize: '0.85rem', marginBottom: '1rem' }}>{error}</p>}
                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                    <button className="btn btn-secondary btn-sm" onClick={() => { setModalOpen(false); setError(''); }}>Cancel</button>
                    <button className="btn btn-primary btn-sm" onClick={handleCreate} disabled={saving}>
                        {saving ? 'Creating...' : 'Create User'}
                    </button>
                </div>
            </Modal>

            {/* Change Role Modal */}
            <Modal isOpen={!!roleEditTarget} onClose={() => setRoleEditTarget(null)} title="Change User Role">
                <p style={{ marginBottom: '0.5rem', fontSize: '0.9rem', color: '#343534' }}>
                    Changing role for <strong>{roleEditTarget?.displayName}</strong>
                </p>
                <p style={{ marginBottom: '1rem', fontSize: '0.82rem', color: 'rgba(52,53,52,0.6)' }}>
                    {roleEditTarget?.email}
                </p>
                <div className="form-group">
                    <label>New Role</label>
                    <select className="input-field" value={newRole} onChange={e => setNewRole(e.target.value as AppUser['role'])}>
                        {assignableRoles.map(r => (
                            <option key={r} value={r}>{r.replace('_', ' ').toUpperCase()}</option>
                        ))}
                    </select>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
                    <button className="btn btn-secondary btn-sm" onClick={() => setRoleEditTarget(null)}>Cancel</button>
                    <button className="btn btn-primary btn-sm" onClick={handleRoleChange} disabled={saving || newRole === roleEditTarget?.role}>
                        {saving ? 'Updating...' : 'Update Role'}
                    </button>
                </div>
            </Modal>

            {/* Delete Confirm */}
            <Modal isOpen={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Delete User?">
                <p style={{ marginBottom: '1.5rem' }}>This will remove the user&apos;s access. Are you sure?</p>
                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                    <button className="btn btn-secondary btn-sm" onClick={() => setDeleteConfirm(null)}>Cancel</button>
                    <button className="btn btn-danger btn-sm" onClick={() => deleteConfirm && handleDelete(deleteConfirm)}>Delete</button>
                </div>
            </Modal>
        </div>
    );
}
