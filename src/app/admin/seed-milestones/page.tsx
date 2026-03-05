'use client';

import React, { useState } from 'react';
import { useAuth, canManageContent } from '@/lib/auth';
import { createMilestone } from '@/lib/firestore';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

// All 23 milestones - titles, dates, and photo folders
// Descriptions are imported dynamically from the data file
const MILESTONE_META = [
    { title: 'Initial Site Visit: Visiting the proposed building site. (යෝජිත විහාර භූමිය නිරීක්ෂණය කිරීම)', date: '2018-09-18T10:00:00.000Z' },
    { title: 'Land Surveying: Surveying the land allocated for the Sarasavi Viharaya. (සරසවි විහාරය සඳහා වෙන් කළ භූමිය මැනුම් කිරීම)', date: '2018-09-22T16:00:00.000Z' },
    { title: 'Land Preparation: Clearing and preparing the sacred grounds. (භූමිය සැකසීම සහ එළිපෙහෙළි කිරීම)', date: '2018-09-23T08:00:00.000Z' },
    { title: 'Sacred Bodhi Plantation: Planting of the Sri Maha Bodhi and Ananda Bodhi saplings. (ශ්‍රී මහා බෝධීන් වහන්සේ සහ ආනන්ද බෝධීන් වහන්සේ රෝපණය කිරීම)', date: '2018-09-25T06:00:00.000Z' },
    { title: 'Kiripalu Bodhi Plantation: Adding to the sacred greenery. (කිරිපලු බෝධීන් වහන්සේ රෝපණය කිරීම)', date: '2018-11-03T08:00:00.000Z' },
    { title: 'Atavisi Bodhi & Tree Plantation: Planting the 28 Bodhi trees and surrounding flora. (අටවිසි බෝධීන් වහන්සේලා සහ විහාරය වටා වෘක්ෂලතා රෝපණය කිරීම)', date: '2018-11-18T08:00:00.000Z' },
    { title: 'First Atavisi Bodhi Pooja: The inaugural offering to the 28 Bodhi trees. (ප්‍රථම අටවිසි බෝධි පූජාව)', date: '2018-11-28T17:00:00.000Z' },
    { title: 'Main Temple Foundation: Base stone laying ceremony for the Sarasavi Viharaya. (විහාර මන්දිරය සඳහා මුල්ගල් තැබීම)', date: '2018-12-14T09:00:00.000Z' },
    { title: 'Dathu Mandiraya: Base stone laying and subsequent opening of the Relic Chamber. (ධාතු මන්දිරය සඳහා මුල්ගල් තැබීම සහ විවෘත කිරීම)', date: '2019-02-21T08:00:00.000Z' },
    { title: 'First Buddha Statue Wadamawima: Arrival of the first Buddha Statue. (ප්‍රථම බුද්ධ ප්‍රතිමා වහන්සේ වැඩම කරවීම)', date: '2019-03-09T09:00:00.000Z' },
    { title: 'Meditation Hall: Construction and opening of the initial meditation space. (භාවනා ශාලාව ඉදිකිරීම සහ විවෘත කිරීම)', date: '2019-07-05T08:00:00.000Z' },
    { title: 'Sarasavi Seya Foundation: Base stone laying for the Stupa. (සරසවි සෑය සඳහා මුල්ගල් තැබීම)', date: '2019-07-05T10:00:00.000Z' },
    { title: 'Sath Budu Mandapaya: Construction of the shrine for the seven Buddhas. (සත් බුදු මණ්ඩපය ඉදිකිරීම)', date: '2019-08-17T08:00:00.000Z' },
    { title: 'Dathu Nidana Ceremony: The sacred enshrining of relics inside the Sarasavi Seya. (සරසවි සෑයේ ධාතු නිධානෝත්සවය)', date: '2019-11-10T06:00:00.000Z' },
    { title: 'Koth Paladavima: Crowning the Stupa with its pinnacle. (සෑයේ කොත් පැළඳවීම)', date: '2019-11-10T10:00:00.000Z' },
    { title: 'Grand Opening of Sarasavi Seya (සරසවි සෑය අභිනවයෙන් විවෘත කිරීම)', date: '2020-03-07T08:00:00.000Z' },
    { title: 'Walakulu Bamma: Construction of the traditional boundary wall. (වළාකුළු බැම්ම ඉදිකිරීම)', date: '2020-06-01T08:00:00.000Z' },
    { title: 'Dharma Shalawa Foundation: Base stone laying for the Preaching Hall. (ධර්ම ශාලාව සඳහා මුල්ගල් තැබීම)', date: '2020-09-24T08:00:00.000Z' },
    { title: 'Saman Devalaya & Eternal Lamp (සමන් දේවාලය සහ දොළොස්මහේ පහන ඉදිකිරීම)', date: '2022-06-01T08:00:00.000Z' },
    { title: 'Gantara Kuluna & Kitchen (ඝණ්ඨාර කුළුණ විවෘත කිරීම සහ මුළුතැන්ගෙය ඉදිකිරීම)', date: '2022-09-01T08:00:00.000Z' },
    { title: '5th Anniversary Special Opening (විහාරස්ථානයට වසර 5ක් පිරීම නිමිත්තෙන් විශේෂ උත්සවය)', date: '2023-09-24T08:00:00.000Z' },
    { title: 'Grand Opening of the Dharma Shalawa (ධර්ම ශාලාව අභිනවයෙන් විවෘත කිරීම)', date: '2024-02-10T08:00:00.000Z' },
    { title: 'Future Expansions: Sangawasaya & Dana Shalawa (සංඝාවාසය සහ දාන ශාලාව සඳහා මුල්ගල් තැබීම)', date: '2024-09-24T08:00:00.000Z' },
];

export default function SeedMilestonesPage() {
    const { appUser, loading: authLoading } = useAuth();
    const [log, setLog] = useState<string[]>([]);
    const [running, setRunning] = useState(false);
    const [done, setDone] = useState(false);
    const [current, setCurrent] = useState(0);

    const addLog = (msg: string) => setLog(prev => [...prev, msg]);

    async function handleSeed() {
        if (!appUser) return;
        setRunning(true);
        setLog([]);
        setDone(false);

        // Dynamically import descriptions from the data file
        let descriptions: string[] = [];
        try {
            const mod = await import('../../../../scripts/milestone-data.mjs');
            descriptions = mod.milestones.map((m: { description: string }) => m.description);
            addLog(`✅ Loaded ${descriptions.length} milestone descriptions from data file`);
        } catch {
            addLog('⚠️ Could not load descriptions file, seeding with empty descriptions');
            descriptions = MILESTONE_META.map(() => '');
        }

        let successCount = 0;
        let failCount = 0;

        for (let i = 0; i < MILESTONE_META.length; i++) {
            const ms = MILESTONE_META[i];
            setCurrent(i + 1);
            const shortTitle = ms.title.split('(')[0].trim();
            addLog(`\n[${i + 1}/${MILESTONE_META.length}] ${shortTitle}`);

            try {
                const now = new Date().toISOString();
                await createMilestone({
                    title: ms.title,
                    description: descriptions[i] || '',
                    date: ms.date,
                    endDate: '',
                    duration: '',
                    coverPhoto: '',
                    photos: [],
                    notifySubscribers: false,
                    isPublished: true,
                    createdAt: now,
                    updatedAt: now,
                    createdBy: appUser.uid,
                });
                addLog(`  ✅ Created successfully`);
                successCount++;
            } catch (err) {
                addLog(`  ❌ Error: ${err}`);
                failCount++;
            }
        }

        addLog(`\n\n🎉 Done! ${successCount} created, ${failCount} failed.`);
        addLog('📸 You can now add photos to each milestone via the Admin > Milestones page.');
        setRunning(false);
        setDone(true);
    }

    if (authLoading) return <LoadingSpinner message="Loading..." />;
    if (!appUser || !canManageContent(appUser.role)) {
        return (
            <div style={{ padding: '3rem', textAlign: 'center' }}>
                <h3>🔒 Access Denied</h3>
                <p>You need admin access to use this page.</p>
            </div>
        );
    }

    return (
        <div>
            <h1 style={{ fontFamily: "'Cinzel', serif", fontSize: '1.5rem', marginBottom: '0.5rem' }}>
                🌱 Seed Milestones
            </h1>
            <p style={{ color: '#666', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                This will create all <strong>23 milestones</strong> in Firestore with their full English &amp; Sinhala descriptions.
                Photos can be uploaded afterwards via the <a href="/admin/milestones" style={{ color: '#b8860b' }}>Milestones admin page</a>.
            </p>

            <div style={{ marginBottom: '1.5rem', padding: '1rem', background: 'rgba(184,134,11,0.05)', borderRadius: '12px', border: '1px solid rgba(184,134,11,0.15)' }}>
                <strong>📋 Milestones to seed ({MILESTONE_META.length}):</strong>
                <ol style={{ fontSize: '0.8rem', marginTop: '0.5rem', paddingLeft: '1.25rem', maxHeight: '200px', overflowY: 'auto' }}>
                    {MILESTONE_META.map((ms, i) => (
                        <li key={i} style={{ marginBottom: '0.25rem', color: '#555' }}>
                            {ms.title.split('(')[0].trim()}
                            <span style={{ color: '#999', marginLeft: '0.5rem' }}>
                                ({new Date(ms.date).toLocaleDateString()})
                            </span>
                        </li>
                    ))}
                </ol>
            </div>

            <button
                className="btn btn-primary"
                onClick={handleSeed}
                disabled={running || done}
                style={{ marginBottom: '1rem', padding: '0.75rem 2rem', fontSize: '1rem' }}
            >
                {running ? `⏳ Seeding ${current}/${MILESTONE_META.length}...` : done ? '✅ Seeding Complete' : '🚀 Seed All 23 Milestones'}
            </button>

            {log.length > 0 && (
                <pre style={{
                    background: '#1a1a1a', color: '#ccc', padding: '1rem',
                    borderRadius: '12px', fontSize: '0.78rem', maxHeight: '350px',
                    overflowY: 'auto', whiteSpace: 'pre-wrap', lineHeight: 1.5,
                }}>
                    {log.join('\n')}
                </pre>
            )}
        </div>
    );
}
