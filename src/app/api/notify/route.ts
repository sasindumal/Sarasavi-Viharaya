import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering — Resend/Firebase need runtime env vars
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    try {
        const { sendNotification } = await import('@/lib/notifications');
        const body = await req.json();
        const { subject, title, description, date, type, link } = body;

        if (!title || !description || !date || !type) {
            return NextResponse.json(
                { error: 'Missing required fields: title, description, date, type' },
                { status: 400 }
            );
        }

        const result = await sendNotification({
            subject: subject || `New ${type === 'event' ? 'Event' : 'Milestone'}: ${title}`,
            title,
            description,
            date,
            type,
            link,
        });

        return NextResponse.json({ message: 'Notifications sent', ...result });
    } catch (error) {
        console.error('Notify error:', error);
        return NextResponse.json({ error: 'Failed to send notifications' }, { status: 500 });
    }
}
