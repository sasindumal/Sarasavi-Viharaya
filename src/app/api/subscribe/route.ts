import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering — Firebase needs runtime env vars
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    try {
        const { addSubscriber } = await import('@/lib/firestore');
        const body = await req.json();
        const { email, name } = body;

        if (!email || typeof email !== 'string') {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
        }

        const id = await addSubscriber(email, name || undefined);
        return NextResponse.json({ id, message: 'Subscribed successfully' });
    } catch (error) {
        console.error('Subscribe error:', error);
        return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const { removeSubscriber } = await import('@/lib/firestore');
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Subscriber ID is required' }, { status: 400 });
        }

        await removeSubscriber(id);
        return NextResponse.json({ message: 'Unsubscribed successfully' });
    } catch (error) {
        console.error('Unsubscribe error:', error);
        return NextResponse.json({ error: 'Failed to unsubscribe' }, { status: 500 });
    }
}
