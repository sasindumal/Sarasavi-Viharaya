import { Resend } from 'resend';
import { getSubscribers } from './firestore';

const resend = new Resend(process.env.RESEND_API_KEY);

interface NotificationPayload {
    subject: string;
    title: string;
    description: string;
    date: string;
    type: 'event' | 'milestone';
    link?: string;
}

export async function sendNotification(payload: NotificationPayload) {
    const subscribers = await getSubscribers();
    if (subscribers.length === 0) return { sent: 0 };

    const emails = subscribers.map(s => s.email);
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'noreply@sarasaviviharaya.lk';

    const html = buildEmailTemplate(payload);

    try {
        await resend.emails.send({
            from: `Sarasavi Viharaya <${fromEmail}>`,
            to: emails,
            subject: payload.subject,
            html,
        });
        return { sent: emails.length };
    } catch (error) {
        console.error('Notification send error:', error);
        throw error;
    }
}

function buildEmailTemplate(payload: NotificationPayload): string {
    const typeLabel = payload.type === 'event' ? '📅 New Event' : '🏛️ New Milestone';
    const formattedDate = new Date(payload.date).toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    });

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0; padding:0; background:#fef3d7; font-family:'Segoe UI',Arial,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#fef3d7; padding:40px 20px;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:20px; overflow:hidden; box-shadow:0 8px 30px rgba(26,25,25,0.1);">
                    <!-- Header -->
                    <tr>
                        <td style="background:linear-gradient(135deg,#F5B926,#ED9F2D); padding:30px; text-align:center;">
                            <h1 style="margin:0; color:#1A1919; font-size:22px; font-weight:700;">🪷 Sarasavi Viharaya</h1>
                            <p style="margin:5px 0 0; color:rgba(26,25,25,0.7); font-size:13px; text-transform:uppercase; letter-spacing:2px;">Buddhist Temple • University of Jaffna</p>
                        </td>
                    </tr>
                    <!-- Content -->
                    <tr>
                        <td style="padding:35px 30px;">
                            <p style="display:inline-block; background:rgba(245,185,38,0.12); color:#d9a01e; padding:4px 14px; border-radius:20px; font-size:12px; font-weight:600; text-transform:uppercase; letter-spacing:1px;">${typeLabel}</p>
                            <h2 style="margin:15px 0 10px; color:#1A1919; font-size:24px; font-weight:700;">${payload.title}</h2>
                            <p style="color:#343534; font-size:16px; line-height:1.7; margin:0 0 20px;">${payload.description}</p>
                            <table cellpadding="0" cellspacing="0" style="background:#fef3d7; border-radius:12px; padding:15px 20px; width:100%;">
                                <tr>
                                    <td style="color:#343534; font-size:14px;">
                                        <strong>📅 Date:</strong> ${formattedDate}
                                    </td>
                                </tr>
                            </table>
                            ${payload.link ? `
                            <p style="text-align:center; margin:25px 0 0;">
                                <a href="${payload.link}" style="display:inline-block; background:linear-gradient(135deg,#F5B926,#ED9F2D); color:#1A1919; padding:12px 30px; border-radius:25px; text-decoration:none; font-weight:600; font-size:14px;">View Details →</a>
                            </p>
                            ` : ''}
                        </td>
                    </tr>
                    <!-- Footer -->
                    <tr>
                        <td style="background:#1A1919; padding:20px 30px; text-align:center;">
                            <p style="margin:0; color:rgba(255,255,254,0.5); font-size:12px;">Sarasavi Viharaya, University of Jaffna, Kilinochchi</p>
                            <p style="margin:5px 0 0; color:rgba(255,255,254,0.3); font-size:11px;">You received this because you subscribed to updates.</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;
}
