import { NextResponse } from 'next/server';

export async function GET() {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
        return NextResponse.json({ error: 'Cloudinary credentials not configured' }, { status: 500 });
    }

    try {
        // Fetch usage from Cloudinary Admin API
        const auth = Buffer.from(`${apiKey}:${apiSecret}`).toString('base64');
        const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/usage`, {
            headers: { Authorization: `Basic ${auth}` },
            next: { revalidate: 300 }, // cache for 5 min
        });

        if (!res.ok) {
            const text = await res.text();
            console.error('Cloudinary usage API error:', text);
            return NextResponse.json({ error: 'Failed to fetch usage' }, { status: 502 });
        }

        const data = await res.json();

        // Extract relevant info
        const storage = data.storage || {};
        const bandwidth = data.bandwidth || {};
        const transformations = data.transformations || {};
        const resources = data.resources || {};
        const derivedResources = data.derived_resources || {};

        return NextResponse.json({
            storage: {
                used: storage.usage || 0,
                limit: storage.limit || 0,
                usedPercent: storage.credits_usage || 0,
            },
            bandwidth: {
                used: bandwidth.usage || 0,
                limit: bandwidth.limit || 0,
                usedPercent: bandwidth.credits_usage || 0,
            },
            transformations: {
                used: transformations.usage || 0,
                limit: transformations.limit || 0,
                usedPercent: transformations.credits_usage || 0,
            },
            resources: {
                used: resources.usage || 0,
                limit: resources.limit || 0,
            },
            derivedResources: {
                used: derivedResources.usage || 0,
                limit: derivedResources.limit || 0,
            },
            plan: data.plan || 'Free',
            lastUpdated: data.last_updated || new Date().toISOString(),
        });
    } catch (err) {
        console.error('Storage API error:', err);
        return NextResponse.json({ error: 'Internal error' }, { status: 500 });
    }
}
