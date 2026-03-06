# 🪷 Sarasavi Viharaya — Buddhist Temple Website

A modern, full-stack Next.js website for the Sarasavi Viharaya Buddhist Temple at the University of Jaffna. Features a glassmorphism light theme, Buddhist-inspired design, event/milestone management with image uploads, role-based admin dashboard, and subscriber email notifications.

## ✨ Features

- **Public Pages** — Home (hero slideshow), History, About, Events, Milestones, Blessings, Acknowledgments, Contact
- **Admin Dashboard** — Role-based (super_admin, admin, moderator) with full CRUD for events, milestones, blessings, acknowledgments, tags, and usershttps://sarasaviviharaya.vercel.app
- **Page Visibility** — Admin can show/hide pages from the header navigation, footer links, and homepage explore section
- **Role Hierarchy** — super_admin manages admins & moderators; admin manages moderators only; moderators manage content only
- **Change Password** — All admin roles can change their own password from the sidebar
- **Contact Message Inbox** — Admin Messages page with read/unread status, search, filters, detail view, and reply via email
- **Blessings Management** — Admin CRUD for blessing messages with photo upload, ordering, and seed existing data
- **Acknowledgments Management** — Admin CRUD with category filter (Donor/Workforce/Special), photo upload, ordering, and seed existing data
- **Image Uploads** — Cover photos and bulk photo album uploads to Cloudinary with progress bar and ETA
- **Event/Milestone Scheduling** — Date + Start Time → End Time with multi-day support and auto-computed duration
- **Email Notifications** — Notify subscribers when new events or milestones are published (via Resend)
- **Contact Form** — Public contact form with Google Maps embed, saves messages to Firestore + optional email notification
- **Subscribe System** — Public email subscription form with Firestore backend
- **Responsive Design** — Glassmorphism theme with Framer Motion animations
- **Hero Shuffle** — Homepage slideshow images randomize on every page load
- **QR Codes** — YouTube and Facebook QR codes on the contact page

---

## 📋 Table of Contents

1. [Quick Start](#-quick-start)
2. [Fix Common Errors](#-fix-common-errors)
3. [Firebase Setup](#-step-1-firebase-setup)
4. [Resend Email Setup](#-step-2-resend-email-setup)
5. [Cloudinary Setup](#-step-3-cloudinary-setup)
6. [Create Admin User](#-step-4-create-your-first-admin-user)
7. [Test Locally](#-step-5-test-everything-locally)
8. [Deploy to Vercel](#-step-6-deploy-to-vercel)
9. [Post-Deployment](#-step-7-post-deployment-checklist)
10. [Project Structure](#-project-structure)
11. [Tech Stack](#-tech-stack)

---

## 🚀 Quick Start

```bash
# Clone and navigate
cd Sarasavi-Viharaya

# Install dependencies
npm install

# Copy env template and fill in your credentials
cp .env.local.example .env.local

# Clear any corrupted cache (if you see Turbopack errors)
rm -rf .next

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔧 Fix Common Errors

### Turbopack Cache Corruption (Panic Errors)

If you see errors like `Failed to restore task data (corrupted database or bug)`:

```bash
rm -rf .next
npm run dev
```

### `next: command not found`

```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### `Module not found: Can't resolve './page.module.css'`

This means the `.next` cache is stale. Run:
```bash
rm -rf .next
npm run dev
```

### Firebase `auth/invalid-api-key`

Your `.env.local` file is missing or has placeholder values. Follow [Step 1](#-step-1-firebase-setup) below.

---

## 🔥 Step 1: Firebase Setup

### 1.1 Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** → name it `sarasavi-viharaya`
3. Disable Google Analytics (optional) → **Create Project**

### 1.2 Enable Authentication

1. In Firebase Console → **Build** → **Authentication**
2. Click **Get Started**
3. Go to **Sign-in method** tab
4. Enable **Email/Password** → **Save**

### 1.3 Create Firestore Database

1. In Firebase Console → **Build** → **Firestore Database**
2. Click **Create database**
3. Choose **Start in test mode** (you'll secure it later)
4. Select a region closest to Sri Lanka (e.g., `asia-south1`)
5. Click **Enable**

### 1.4 Set Firestore Security Rules

Go to **Firestore** → **Rules** tab and paste:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    function isAuth() {
      return request.auth != null;
    }

    function getUserRole() {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role;
    }

    function roleLevel(role) {
      return role == 'super_admin' ? 3
           : role == 'admin' ? 2
           : role == 'moderator' ? 1
           : 0;
    }

    function canManage() {
      return isAuth() && roleLevel(getUserRole()) >= 1;
    }

    function canManageUsers() {
      return isAuth() && roleLevel(getUserRole()) >= 2;
    }

    // Events — public read, admin write
    match /events/{eventId} {
      allow read: if true;
      allow create, update, delete: if canManage();
    }

    // Milestones — public read, admin write
    match /milestones/{milestoneId} {
      allow read: if true;
      allow create, update, delete: if canManage();
    }

    // Tags — public read, admin write
    match /tags/{tagId} {
      allow read: if true;
      allow create, delete: if canManage();
    }

    // Blessings — public read, admin write
    match /blessings/{blessingId} {
      allow read: if true;
      allow create, update, delete: if canManage();
    }

    // Acknowledgments — public read, admin write
    match /acknowledgments/{acknowledgmentId} {
      allow read: if true;
      allow create, update, delete: if canManage();
    }

    // Users — role hierarchy enforcement
    // super_admin can manage admin & moderator
    // admin can manage moderator only
    match /users/{userId} {
      allow read: if isAuth() && (request.auth.uid == userId || canManageUsers());
      allow create: if canManageUsers()
        && roleLevel(getUserRole()) > roleLevel(request.resource.data.role);
      allow update: if isAuth()
        && (
          request.auth.uid == userId
          || (
            canManageUsers()
            && roleLevel(getUserRole()) > roleLevel(resource.data.role)
            && roleLevel(getUserRole()) > roleLevel(request.resource.data.role)
          )
        );
      allow delete: if canManageUsers()
        && roleLevel(getUserRole()) > roleLevel(resource.data.role);
    }

    // Subscribers — public can subscribe, admin can read/manage
    match /subscribers/{subscriberId} {
      allow read: if canManage();
      allow create: if true;
      allow update, delete: if canManage();
    }

    // Contact Messages — public can create, admin can read/manage
    match /contactMessages/{messageId} {
      allow read: if canManage();
      allow create: if true;
      allow update, delete: if canManage();
    }

    // Site Config — public read (page visibility), admin write
    match /siteConfig/{configId} {
      allow read: if true;
      allow write: if canManage();
    }
  }
}
```

Click **Publish**.

### 1.5 Get Firebase Config

1. Go to **Project Settings** (gear icon) → **General**
2. Scroll to **"Your apps"** → Click **Web** (`</>` icon)
3. Register app name: `sarasavi-viharaya-web`
4. Copy the config values into `.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=sarasavi-viharaya.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=sarasavi-viharaya
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=sarasavi-viharaya.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
```

---

## 📧 Step 2: Resend Email Setup

### 2.1 Create Resend Account

1. Go to [resend.com](https://resend.com) → Sign up (free tier: 3,000 emails/month)
2. Go to **API Keys** → **Create API Key**
3. Copy the key to `.env.local`:

```env
RESEND_API_KEY=re_abc123...
```

### 2.2 Verify Domain (Optional but Recommended)

For production, add your domain:

1. Go to **Domains** → **Add Domain**
2. Add DNS records as instructed
3. Once verified, update:

```env
RESEND_FROM_EMAIL=notifications@yourdomain.com
```

> **Without a verified domain**, use `onboarding@resend.dev` for testing.

---

## ☁️ Step 3: Cloudinary Setup

Required for cover photo and photo album uploads in the admin panel.

1. Go to [cloudinary.com](https://cloudinary.com) → Sign up (free tier: 25 GB)
2. From the Dashboard, copy your **Cloud Name**
3. Go to **Settings** → **Upload** → Create an **Upload Preset**:
   - Name: `sarasavi-viharaya` (or any name)
   - Signing Mode: **Unsigned**
4. Also copy your **API Key** and **API Secret** from the Dashboard
5. Add to `.env.local`:

```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_preset_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

> **Upload Features**: Admin panel supports single cover photo upload and bulk photo album uploads with real-time progress bar and estimated time remaining.

---

## 👤 Step 4: Create Your First Admin User

### 4.1 Create User in Firebase

1. Go to Firebase Console → **Authentication** → **Users**
2. Click **Add user**
3. Enter email (e.g., `admin@sarasaviviharaya.lk`) and password
4. Copy the **User UID** that appears

### 4.2 Create User Document in Firestore

1. Go to Firebase Console → **Firestore Database**
2. Click **Start collection** → Collection ID: `users`
3. Click **Add document** → Set Document ID to the **User UID** from step 4.1
4. Add these fields:

| Field         | Type   | Value                         |
|---------------|--------|-------------------------------|
| `email`       | string | `admin@sarasaviviharaya.lk`   |
| `displayName` | string | `Super Admin`                 |
| `role`        | string | `super_admin`                 |
| `createdAt`   | string | `2026-03-01T00:00:00.000Z`    |
| `createdBy`   | string | `system`                      |

5. Click **Save**

### 4.3 Test Login

1. Start the dev server: `npm run dev`
2. Go to [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
3. Sign in with the email and password from step 4.1
4. You should see the admin dashboard with sidebar

> **Roles**: `super_admin` (full access — manages admins & moderators), `admin` (manage content + moderators), `moderator` (manage content only). All roles can change their own password from the admin sidebar.

---

## ✅ Step 5: Test Everything Locally

Run through this checklist before deploying:

```bash
# Clean start
rm -rf .next
npm run dev
```

### Public Pages
- [ ] Home page loads with hero slideshow (images shuffle on each load) and subscribe form
- [ ] Subscribe form works (check Firestore `subscribers` collection)
- [ ] History, About, Blessings, Contact pages render correctly
- [ ] Events listing page shows published events from Firestore
- [ ] Milestones listing page shows published milestones from Firestore
- [ ] Event/Milestone detail pages load with cover photo, description, photo album

### Admin Dashboard
- [ ] Login at `/admin/login` → redirects to dashboard
- [ ] Dashboard shows stat cards and quick actions
- [ ] Create an **Event** with date/time, cover photo upload, and photo album upload
- [ ] Edit/delete events; verify progress bar and ETA show during uploads
- [ ] Create a **Milestone** with same upload features
- [ ] Create and delete **Tags**
- [ ] Create a new **User** (moderator role)
- [ ] Toggle **Notify Subscribers** when creating → verify email sent
- [ ] **Messages** page shows contact form submissions with unread count
- [ ] Open a message → auto-marks as read, shows full detail + reply link
- [ ] Mark messages as read/unread, delete messages
- [ ] **Blessings** page — add/edit/delete blessings, seed existing data, reorder, upload photos
- [ ] **Acknowledgments** page — add/edit/delete with category filter, seed existing data, reorder
- [ ] **Pages** page — toggle page visibility in header, footer, and homepage; verify changes apply
- [ ] **Change Password** — click in sidebar, enter current + new password, verify update
- [ ] **Role Hierarchy** — super_admin sees all users, admin sees only moderators
- [ ] **Change Role** — super_admin can change admin↔moderator, admin cannot change admin roles

### Contact & API Routes
- [ ] Submit the **Contact** form → check Firestore `contactMessages` collection
- [ ] Contact message appears in Admin → **Messages** page
- [ ] Subscribe via the home page form → check Firestore `subscribers` collection
- [ ] Test notify endpoint:
```bash
curl -X POST http://localhost:3000/api/notify \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","description":"Testing","date":"2026-04-01","type":"event"}'
```

### Build Check
```bash
npm run build
```
Should show all routes generated without errors.

---

## 🌐 Step 6: Deploy to Vercel

### 6.1 Push to GitHub

```bash
# Initialize git (if not already)
git init
git add .
git commit -m "Initial commit: Sarasavi Viharaya website"

# Create GitHub repo and push
# Go to github.com → New repository → "sarasavi-viharaya"
git remote add origin https://github.com/YOUR_USERNAME/sarasavi-viharaya.git
git branch -M main
git push -u origin main
```

### 6.2 Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) → Sign in with GitHub
2. Click **"Add New…"** → **Project**
3. Import `sarasavi-viharaya` from your GitHub repos
4. **Framework Preset**: Next.js (auto-detected)
5. **Root Directory**: Leave as `.` (default)

### 6.3 Add Environment Variables

In Vercel project settings → **Environment Variables**, add ALL variables from your `.env.local`:

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | `AIza...` |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | `your-project.firebaseapp.com` |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | `your-project-id` |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | `your-project.appspot.com` |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | `123456789` |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | `1:123:web:abc` |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | `your_cloud_name` |
| `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` | `your_preset_name` |
| `CLOUDINARY_API_KEY` | `your_api_key` |
| `CLOUDINARY_API_SECRET` | `your_api_secret` |
| `RESEND_API_KEY` | `re_abc123...` |
| `RESEND_FROM_EMAIL` | `noreply@yourdomain.com` |
| `NEXT_PUBLIC_APP_URL` | `https://your-domain.vercel.app` |

> ⚠️ Make sure all `NEXT_PUBLIC_*` vars are added — they're embedded into the client bundle at build time.

6. Click **Deploy** 🚀

### 6.4 Add Custom Domain (Optional)

1. In Vercel → **Settings** → **Domains**
2. Add your domain (e.g., `sarasaviviharaya.lk`)
3. Update DNS records as instructed by Vercel
4. After verification, update:
   - `NEXT_PUBLIC_APP_URL` in Vercel env vars
   - Firebase Console → **Authentication** → **Settings** → **Authorized domains** → add your domain

---

## 📝 Step 7: Post-Deployment Checklist

### Security
- [ ] Update Firestore rules (replace test mode with the rules from Step 1.4)
- [ ] In Firebase Console → **Authentication** → **Settings** → **Authorized domains** → add your Vercel URL
- [ ] Remove `localhost` from authorized domains (for production)

### Firebase Indexes
If you get Firestore index errors in production logs:
1. Click the index creation link in the error message
2. Or manually create in Firebase Console → **Firestore** → **Indexes**

### SEO & Analytics
- [ ] Update `src/app/layout.tsx` metadata (title, description, OG images)
- [ ] Add Google Analytics or Firebase Analytics
- [ ] Submit sitemap to Google Search Console

### Monitoring
- [ ] Check Vercel deployment logs for errors
- [ ] Monitor Firebase usage dashboard (quotas)
- [ ] Check Resend dashboard for email delivery

---

## 📁 Project Structure

```
sarasavi-viharaya/
├── src/
│   ├── app/
│   │   ├── page.tsx                    # Landing page (hero shuffle)
│   │   ├── layout.tsx                  # Root layout (header/footer)
│   │   ├── globals.css                 # Design system
│   │   ├── page.module.css             # Landing page styles
│   │   ├── about/                      # About page
│   │   ├── acknowledgments/            # Acknowledgments page
│   │   ├── blessings/                  # Blessings page
│   │   ├── contact/                    # Contact page
│   │   ├── events/                     # Events listing + [id] detail
│   │   ├── history/                    # History page
│   │   ├── milestones/                 # Milestones listing + [id] detail
│   │   ├── admin/
│   │   │   ├── layout.tsx              # Admin sidebar, auth guard, change password
│   │   │   ├── login/page.tsx          # Admin login
│   │   │   ├── page.tsx                # Dashboard home
│   │   │   ├── events/page.tsx         # Events CRUD + image uploads
│   │   │   ├── milestones/page.tsx     # Milestones CRUD + image uploads
│   │   │   ├── blessings/page.tsx      # Blessings CRUD + photo upload + seed
│   │   │   ├── acknowledgments/page.tsx# Acknowledgments CRUD + categories + seed
│   │   │   ├── pages/page.tsx          # Page visibility management
│   │   │   ├── messages/page.tsx       # Contact message inbox
│   │   │   ├── tags/page.tsx           # Tags management
│   │   │   └── users/page.tsx          # User management + role change
│   │   └── api/
│   │       ├── contact/route.ts        # Contact form (Firestore + email)
│   │       ├── subscribe/route.ts      # Email subscription
│   │       └── notify/route.ts         # Send notifications to subscribers
│   ├── components/
│   │   ├── layout/                     # Header, Footer
│   │   └── ui/                         # GlassCard, Modal, TagChip, PhotoAlbum, etc.
│   ├── lib/
│   │   ├── firebase.ts                 # Firebase init
│   │   ├── firestore.ts                # Firestore CRUD helpers
│   │   ├── auth.ts                     # Auth hooks, role hierarchy & permission utils
│   │   ├── cloudinary.ts               # Image upload utils (single, bulk, progress)
│   │   └── notifications.ts            # Resend email sending
│   └── types/
│       └── index.ts                    # TypeScript interfaces
├── public/
│   └── images/hero/                    # Hero slideshow images
├── .env.local                          # Environment variables (not committed)
├── next.config.ts                      # Next.js config
├── package.json
└── tsconfig.json
```

---

## 🏛️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **Next.js 16** | React framework (App Router, Turbopack) |
| **TypeScript** | Type safety |
| **Firebase Auth** | Admin authentication |
| **Cloud Firestore** | NoSQL database |
| **Cloudinary** | Image hosting & uploads |
| **Resend** | Email notifications |
| **Framer Motion** | Animations |
| **Vercel** | Hosting & deployment |

---

## 📄 Environment Variables

```env
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Resend
RESEND_API_KEY=
RESEND_FROM_EMAIL=

# Contact (optional — email copy of contact form messages)
CONTACT_NOTIFY_EMAIL=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

> Built with 🪷 for the Buddhist Brotherhood Society, University of Jaffna.
