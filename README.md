# RealmQuest — Deployment Guide

A mythology-themed learning app for Ontario Grade 6 curriculum.
**Now with cloud sync** — Cece plays on her phone, you see her progress on yours in real-time.

---

## Deploy to Vercel (Free) — Step by Step

### Step 1: Get the project on GitHub

**If you already have the repo from before:**
1. Go to your `realmquest` repository on GitHub
2. Delete all existing files (or replace them)
3. Upload all the new files from this folder

**If starting fresh:**
1. Go to github.com and sign in
2. Click "New" to create a new repository
3. Name it `realmquest`, keep it Public, click "Create repository"
4. Click "uploading an existing file"
5. Open this folder so you see all the files and the `src/` folder
6. Select ALL files and folders → drag onto GitHub → click "Commit changes"

### Step 2: Deploy on Vercel

1. Go to vercel.com → sign in with GitHub
2. Click "Add New Project" → select your `realmquest` repo
3. Vercel auto-detects Vite + React — click "Deploy"
4. Wait ~60 seconds. You get a URL like `realmquest.vercel.app`

### Step 3: Share with Cece

1. Send Cece the URL
2. She opens it in Safari on her iPhone
3. Taps Share → "Add to Home Screen"
4. It appears as an app icon

### Step 4: Access Parent Dashboard

1. Open the same URL on your own phone
2. Tap "Parent Dashboard" → enter PIN: 1234
3. You see Cece's live progress — updated in real-time as she plays

---

## How Cloud Sync Works

- All data is stored in Firebase Firestore (Google's free cloud database)
- When Cece completes a quest, the data syncs to the cloud within 1 second
- When you open the parent dashboard on your phone, it pulls live data
- If either phone is offline, data saves locally and syncs when back online
- Both devices always see the same progress, Drachma balance, and reward claims

---

## Important Notes

### Firebase Free Tier
- 1 GB storage, 50,000 reads/day, 20,000 writes/day
- A family app will use less than 1% of this

### Security — Update Rules After 30 Days
The database starts in "test mode" (open for 30 days). After that, go to:
Firebase Console → Firestore → Rules tab → replace with:

    rules_version = '2';
    service cloud.firestore {
      match /databases/{database}/documents {
        match /appData/{doc} {
          allow read, write: if true;
        }
      }
    }

### Changing the Parent PIN
In `src/App.jsx`, find `pin: "1234"` and change it.
Push to GitHub → Vercel auto-deploys.

---

## Project Structure

    realmquest/
    ├── index.html
    ├── package.json
    ├── vite.config.js
    ├── src/
    │   ├── main.jsx
    │   ├── firebase.js    ← Firebase config
    │   └── App.jsx        ← The full app
    └── README.md

---

## Running Locally (Optional)

    npm install
    npm run dev

Open http://localhost:5173
