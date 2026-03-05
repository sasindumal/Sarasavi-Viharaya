/**
 * Seed Milestones Script
 * 1. Uploads photos to Cloudinary (direct unsigned upload)
 * 2. Sends milestone data to the Next.js API route which writes to Firestore
 *
 * Usage:
 *   1. Start the dev server: npm run dev
 *   2. Run: node scripts/seed-milestones.mjs
 */

import fs from 'fs';
import path from 'path';

// Cloudinary config
const CLOUD_NAME = 'dp9c9nv8f';
const UPLOAD_PRESET = 'sarasavi-viharaya';
const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

// Next.js API route
const API_URL = 'http://localhost:3000/api/seed-milestones';

const PHOTOS_BASE = '/Users/sasindumalhara/Downloads/Milestones Achieved';
const VALID_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB Cloudinary free plan limit

async function uploadToCloudinary(filePath) {
    const fileBuffer = fs.readFileSync(filePath);
    const fileName = path.basename(filePath);
    const blob = new Blob([fileBuffer]);
    const formData = new FormData();
    formData.append('file', blob, fileName);
    formData.append('upload_preset', UPLOAD_PRESET);
    formData.append('folder', 'sarasavi-viharaya/milestones');

    const res = await fetch(UPLOAD_URL, { method: 'POST', body: formData });
    if (!res.ok) {
        const err = await res.text();
        throw new Error(`Upload failed for ${fileName}: ${err}`);
    }
    const data = await res.json();
    return data.secure_url;
}

function getImageFiles(folderName) {
    const dirPath = path.join(PHOTOS_BASE, folderName);
    if (!fs.existsSync(dirPath)) return [];
    return fs.readdirSync(dirPath)
        .filter(f => VALID_EXTENSIONS.includes(path.extname(f).toLowerCase()))
        .filter(f => {
            const size = fs.statSync(path.join(dirPath, f)).size;
            if (size > MAX_FILE_SIZE) {
                console.log(`    ⚠️  Skipping ${f} (${(size / 1024 / 1024).toFixed(1)}MB > 10MB limit)`);
                return false;
            }
            return true;
        })
        .sort()
        .map(f => path.join(dirPath, f));
}

async function uploadPhotos(folderName) {
    const files = getImageFiles(folderName);
    if (files.length === 0) return { coverPhoto: '', photos: [] };

    console.log(`  Uploading ${files.length} photos from "${folderName}"...`);
    const urls = [];
    for (let i = 0; i < files.length; i++) {
        try {
            console.log(`    [${i + 1}/${files.length}] ${path.basename(files[i])}`);
            const url = await uploadToCloudinary(files[i]);
            urls.push(url);
        } catch (err) {
            console.log(`    ⚠️  Failed, skipping: ${err.message}`);
        }
    }
    return { coverPhoto: urls[0] || '', photos: urls.slice(1) };
}

// Import milestone data
const { milestones } = await import('./milestone-data.mjs');

async function main() {
    console.log(`\n🏛️  Seeding ${milestones.length} milestones...\n`);

    const readyMilestones = [];

    // Step 1: Upload all photos
    for (let i = 0; i < milestones.length; i++) {
        const ms = milestones[i];
        console.log(`\n[${i + 1}/${milestones.length}] ${ms.title.split('(')[0].trim()}`);

        const { coverPhoto, photos } = await uploadPhotos(ms.photoFolder);
        readyMilestones.push({
            ...ms,
            coverPhoto,
            photos,
        });
    }

    console.log('\n\n📤 Sending milestones to Firestore via API route...');

    // Step 2: Send all milestones to API route in batches of 5
    const BATCH_SIZE = 5;
    for (let i = 0; i < readyMilestones.length; i += BATCH_SIZE) {
        const batch = readyMilestones.slice(i, i + BATCH_SIZE);
        console.log(`  Batch ${Math.floor(i / BATCH_SIZE) + 1}: milestones ${i + 1}-${Math.min(i + BATCH_SIZE, readyMilestones.length)}`);

        const res = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ milestones: batch }),
        });

        if (!res.ok) {
            const err = await res.text();
            console.error(`  ❌ API error: ${err}`);
            process.exit(1);
        }

        const result = await res.json();
        console.log(`  ✅ Created ${result.count} milestones`);
        for (const r of result.results) {
            console.log(`     ${r.id}: ${r.title.split('(')[0].trim()}`);
        }
    }

    console.log('\n🎉 All milestones seeded successfully!\n');
    process.exit(0);
}

main().catch(err => {
    console.error('❌ Error:', err);
    process.exit(1);
});
