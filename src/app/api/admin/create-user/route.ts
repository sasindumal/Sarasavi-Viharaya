import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/admin/create-user
 *
 * Creates a new Firebase Auth user server-side using the Firebase REST API,
 * so the currently signed-in admin session is NOT disrupted.
 *
 * Body: { email: string; password: string }
 * Returns: { uid: string }
 */
export async function POST(req: NextRequest) {
    const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    if (!apiKey) {
        return NextResponse.json({ error: 'Firebase API key not configured' }, { status: 500 });
    }

    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ error: 'email and password are required' }, { status: 400 });
        }

        // Use Firebase Auth REST API to sign up a new user without affecting any existing session
        const res = await fetch(
            `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, returnSecureToken: false }),
            }
        );

        const data = await res.json();

        if (!res.ok) {
            // Map common Firebase REST error messages to user-friendly ones
            const message: string = data?.error?.message || 'Failed to create user';
            if (message.includes('EMAIL_EXISTS')) {
                return NextResponse.json({ error: 'This email is already registered.' }, { status: 409 });
            }
            if (message.includes('WEAK_PASSWORD')) {
                return NextResponse.json({ error: 'Password must be at least 6 characters.' }, { status: 400 });
            }
            return NextResponse.json({ error: message }, { status: 400 });
        }

        return NextResponse.json({ uid: data.localId });
    } catch (err) {
        console.error('create-user API error:', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
