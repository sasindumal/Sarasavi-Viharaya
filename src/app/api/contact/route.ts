import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { name, email, subject, message } = body;

        if (!name || !email || !subject || !message) {
            return NextResponse.json(
                { error: 'All fields are required' },
                { status: 400 }
            );
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: 'Invalid email format' },
                { status: 400 }
            );
        }

        // Save to Firestore (always reliable)
        const { addContactMessage } = await import('@/lib/firestore');
        await addContactMessage({
            name,
            email,
            subject,
            message,
            isRead: false,
            createdAt: new Date().toISOString(),
        });

        // Also try to send email notification (best effort)
        try {
            const { Resend } = await import('resend');
            const resend = new Resend(process.env.RESEND_API_KEY);
            const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
            const toEmail = process.env.CONTACT_NOTIFY_EMAIL || fromEmail;

            await resend.emails.send({
                from: `Sarasavi Viharaya <${fromEmail}>`,
                to: [toEmail],
                replyTo: email,
                subject: `Contact: ${subject}`,
                html: buildContactEmail(name, email, subject, message),
            });
        } catch (emailErr) {
            console.warn('Email notification failed (message saved to Firestore):', emailErr);
        }

        return NextResponse.json({ message: 'Message sent successfully' });
    } catch (error) {
        console.error('Contact form error:', error);
        return NextResponse.json(
            { error: 'Failed to send message' },
            { status: 500 }
        );
    }
}

function buildContactEmail(name: string, email: string, subject: string, message: string): string {
    return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0; padding:0; background:#fef3d7; font-family:'Segoe UI',Arial,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#fef3d7; padding:40px 20px;">
        <tr><td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:20px; overflow:hidden; box-shadow:0 8px 30px rgba(26,25,25,0.1);">
                <tr><td style="background:linear-gradient(135deg,#F5B926,#ED9F2D); padding:30px; text-align:center;">
                    <h1 style="margin:0; color:#1A1919; font-size:22px; font-weight:700;">🪷 Sarasavi Viharaya</h1>
                    <p style="margin:5px 0 0; color:rgba(26,25,25,0.7); font-size:13px; text-transform:uppercase; letter-spacing:2px;">New Contact Message</p>
                </td></tr>
                <tr><td style="padding:35px 30px;">
                    <h2 style="margin:0 0 20px; color:#1A1919; font-size:22px; font-weight:700;">${subject}</h2>
                    <table cellpadding="0" cellspacing="0" style="background:#fef3d7; border-radius:12px; width:100%; margin-bottom:20px;">
                        <tr><td style="padding:15px 20px;">
                            <p style="margin:0 0 5px; color:#343534; font-size:14px;"><strong>From:</strong> ${name}</p>
                            <p style="margin:0; color:#343534; font-size:14px;"><strong>Email:</strong> <a href="mailto:${email}" style="color:#d9a01e;">${email}</a></p>
                        </td></tr>
                    </table>
                    <div style="color:#343534; font-size:16px; line-height:1.7; white-space:pre-wrap;">${message}</div>
                    <p style="text-align:center; margin:25px 0 0;">
                        <a href="mailto:${email}?subject=Re: ${encodeURIComponent(subject)}" style="display:inline-block; background:linear-gradient(135deg,#F5B926,#ED9F2D); color:#1A1919; padding:12px 30px; border-radius:25px; text-decoration:none; font-weight:600; font-size:14px;">Reply →</a>
                    </p>
                </td></tr>
                <tr><td style="background:#1A1919; padding:20px 30px; text-align:center;">
                    <p style="margin:0; color:rgba(255,255,254,0.5); font-size:12px;">Sarasavi Viharaya, University of Jaffna, Kilinochchi</p>
                    <p style="margin:5px 0 0; color:rgba(255,255,254,0.3); font-size:11px;">Sent via the website contact form.</p>
                </td></tr>
            </table>
        </td></tr>
    </table>
</body>
</html>`;
}
