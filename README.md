# ETERNITY — A Cinematic Birthday Experience

> *"Every beautiful story has a person who makes it unforgettable."*

**ETERNITY** is a bespoke, luxury digital gift website built with Next.js 16, React 19, TypeScript, Tailwind CSS, Framer Motion, and Supabase. Crafted with the art direction of high-end editorial publications and cinematic title sequences, it combines an interactive story, a personal memory museum, celebratory birthday rituals, and a full content management system into a single production-ready experience.

---

## ✦ Key Features

1. **The Cinematic Opening**
   - Fullscreen stardust particle background with gold ambient nebula light.
   - Elegant headline reveal: *"For someone who makes ordinary moments extraordinary."* & *"A Story Called You."*
   - Interactive button: **"ENTER YOUR LITTLE UNIVERSE"** triggering champagne-gold confetti and a dramatic reveal of the birthday person's name.
   - Skip option for accessibility and reduced-motion preferences.

2. **The Hero — "Today Is Yours"**
   - Editorial serif headlines with delicate gold separators and date tags.
   - Large cinematic portrait frame with subtle hover depth and film grain.
   - Smooth scroll anchor directing to the memory archive.

3. **Memory Gallery — "Little Moments. Infinite Meaning."**
   - Asymmetric editorial masonry grid with varied aspect ratios (tall portraits, wide feature spans, landscape cards).
   - Scroll reveals, soft hover zoom, locations, dates, and personal thought captions.
   - Fullscreen Lightbox modal supporting keyboard navigation (`←`, `→`, `Esc`) and touch navigation.

4. **Video Memories — "Not Just Memories. Little Pieces of Time."**
   - Film archive layout with custom video poster thumbnails, play pulse indicators, and metadata.
   - Dedicated modal video player featuring custom scrub progress bar, play/pause, mute/unmute, and fullscreen controls.
   - Adheres to browser autoplay restrictions (never plays with unexpected sound).

5. **The Story Timeline — "Our Little Universe"**
   - Alternating editorial horizontal/vertical timeline connected by a golden stardust line.
   - Milestone nodes, multi-photo attachments with full-resolution expanders, and pull-quote personal notes.

6. **The Heartfelt Letter — "One Thing I Never Want You to Forget"**
   - Realistically styled 3D envelope with a champagne-gold wax seal stamped with `"E"`.
   - On opening, the envelope unfolds with an ambient warm ivory glow.
   - Smooth, comfortable reading layout with paragraph breaks, vintage keepsake photo, signature, and fold-back option.

7. **The Birthday Surprise — "A Little Magic"**
   - Custom stylized SVG/CSS luxury birthday cake with glowing golden tiers and flickering candle flames.
   - Touch/click to **Blow Out Candles** (no microphone permissions required).
   - Smoke wisps, celebratory confetti explosion, wish reveal banner, and an expandable **Secret Surprise** drawer (for private photos, notes, or inside jokes).

8. **"Things That Make You, You"**
   - Interactive card collection showcasing unique quirks, cherished habits, and reasons for appreciation.
   - Card expansion reveals heartfelt anecdotes and memories.

9. **Atmospheric Soundtrack Player**
   - Discrete, luxury floating audio pill with pulsing audio visualizer bars.
   - Plays uploaded MP3/audio files or falls back to a built-in ethereal ambient chord generator powered by the Web Audio API.

10. **The Final Scene — "A Beautiful Goodbye"**
    - Cinematic movie outro with the birthday tribute: *"HAPPY BIRTHDAY, [RECIPIENT NAME]."*
    - Smooth "Revisit The Memories" scroll trigger and discreet curator portal link.

11. **Curator & Admin Portal (`/admin`)**
    - Securely authenticated management suite to customize every aspect without touching code:
      - Recipient Name, Birthday Date, Tagline, Quotes, and Hero Portrait.
      - Drag-and-drop Multi-image Gallery Uploader, ordering, captions, and layout aspect ratios.
      - Video Archive Manager (URLs, posters, titles, dates).
      - Story Timeline Builder (Milestones, narratives, multi-photo arrays).
      - Heartfelt Letter Editor (Paragraphs, greetings, signoffs).
      - Birthday Cake & Secret Surprise Manager.
      - Quirks & Nuances Builder.
      - Background Music Uploader.
      - Section Visibility Toggles (show/hide any section on demand).
      - Cloud persistence with one-click JSON backup & export.

---

## ✦ Architecture & Technology Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, Turbopack)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with custom luxury tokens:
  - Obsidian Black (`#0B0B0D`)
  - Midnight Charcoal (`#151519`)
  - Champagne Gold (`#D6B779` / `#E8CF9A`)
  - Warm Ivory (`#F5F0E8`)
  - Muted Rose (`#B98E96`)
- **Typography**: Google Fonts via `next/font/google`:
  - Cormorant Garamond (Editorial Serif)
  - Inter (Clean Humanist Sans)
- **Motion**: [Framer Motion](https://www.framer.com/motion/) & [canvas-confetti](https://www.npmjs.com/package/canvas-confetti)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Backend & Cloud Storage**: [Supabase](https://supabase.com/) (PostgreSQL + Cloud Storage + Auth)
- **Dual-Mode Resilient Persistence**:
  - Automatically connects to Supabase when credentials exist in `.env.local`.
  - Runs in local resilient mode with full upload and editing capabilities when offline or before Supabase keys are provided.

---

## ✦ Getting Started

### 1. Running Locally
In the `eternity` directory:

```bash
# Install dependencies (already completed)
npm install

# Start development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

### 2. Accessing the Curator / Admin Portal
Visit [http://localhost:3000/admin](http://localhost:3000/admin) directly, or click the subtle lock icon in the footer of the website.

- **Default Local Passkey**: `eternity2026`

---

## ✦ Connecting Supabase (Production Cloud Persistence)

To sync content and media across devices in real time:

1. Create a free account at [supabase.com](https://supabase.com) and create a new project.
2. Go to the **SQL Editor** in your Supabase dashboard.
3. Open `supabase/schema.sql` from this repository, copy its contents, and run it. This will:
   - Create tables: `site_config`, `gallery_images`, `video_memories`, `timeline_entries`, `letter_content`, `surprise_content`, `personal_details`.
   - Configure public read policies and authenticated admin write policies.
   - Create the `eternity-media` storage bucket for photos, videos, and music.
4. Copy your project credentials into `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
   ```
5. Restart the server (`npm run dev` or `npm run build && npm start`).
6. The admin portal will display a green confirmation badge indicating that cloud synchronization is active!

---

## ✦ Deployment to Vercel

1. Push this project repository to GitHub or GitLab.
2. Go to [vercel.com](https://vercel.com) and import the repository.
3. In **Environment Variables**, add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_ADMIN_LOCAL_KEY` (optional fallback)
4. Click **Deploy**. Your custom cinematic birthday experience is now live on the web!
