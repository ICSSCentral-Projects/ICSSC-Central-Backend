# 🎓 ICSSC Central — UST CICS Student Council Website

> The official web platform of the **Integrated CICS Student Council (ICSSC)** of the University of Santo Tomas. This system powers the council's public-facing website and its content management backend.

---

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [System Architecture](#system-architecture)
- [Tech Stack](#tech-stack)
- [Repositories](#repositories)
- [Quick Start](#quick-start)
- [Environment Variables](#environment-variables)
- [Content Types (Data Models)](#content-types-data-models)
- [Website Pages & Features](#website-pages--features)
- [External Services](#external-services)
- [Deployment](#deployment)
- [Officer Handover Checklist](#officer-handover-checklist)
- [Contributing Guidelines](#contributing-guidelines)

---

## Project Overview

ICSSC Central is split into two repositories that work together:

| Repo | Description | Runtime |
|------|-------------|---------|
| `ICSSC-Central-Backend` | **Strapi CMS** — manages all content and exposes REST APIs | Node.js ≥ 20 |
| `icsscentral-website` | **React + Vite frontend** — the public website consumed by students | Browser |

The backend is the **single source of truth** for all dynamic content (events, articles, council members, organizations, FOI requests, inquiries). The frontend fetches data from the backend at runtime and also integrates with Supabase and Cloudinary.

---

## System Architecture

```
┌─────────────────────────────┐       REST API        ┌──────────────────────────────┐
│   icsscentral-website        │ ──────────────────►  │   ICSSC-Central-Backend       │
│   React + Vite + Tailwind    │ ◄──────────────────   │   Strapi CMS v5               │
│   Deployed on Netlify        │      JSON responses   │   Deployed on Railway         │
└─────────────────────────────┘                        └──────────────────────────────┘
         │                                                         │
         │                                                         │
         ▼                                                         ▼
  ┌─────────────┐                                       ┌──────────────────┐
  │   Supabase   │                                       │   PostgreSQL DB   │
  │  (Auth/DB)   │                                       │  (on Railway)     │
  └─────────────┘                                        └──────────────────┘
         │                                                         │
         └──────────────────► Cloudinary ◄────────────────────────┘
                               (Media Storage)
```

---

## Tech Stack

### Backend (`ICSSC-Central-Backend`)
- **Strapi v5** — Headless CMS with REST API
- **PostgreSQL** — Primary database (hosted on Railway)
- **Cloudinary** — Media/image storage provider
- **SendGrid** — Transactional email (via `ust.icssc.noreply@gmail.com`)
- **Node.js ≥ 20, npm ≥ 6**
- **TypeScript**

### Frontend (`icsscentral-website`)
- **React 18** — UI framework
- **Vite 6** — Build tool and dev server
- **React Router v7** — Client-side routing
- **Tailwind CSS v4** — Styling
- **shadcn/ui + Radix UI** — Component library
- **Supabase** — Auth and supplemental database
- **Cloudinary** — Image delivery
- **Motion (Framer Motion)** — Animations
- **Deployed on Netlify**

---

## Repositories

```
ICSSC-Central-Backend/       ← Strapi CMS Backend
├── config/                  ← Database, plugins, server configuration
├── src/
│   └── api/                 ← All content type endpoints
│       ├── about/
│       ├── article/
│       ├── author/          ← "Council Members" in the CMS
│       ├── event/
│       ├── foi-request/
│       ├── global/
│       ├── inquiry/
│       ├── organization/
│       └── program/
├── scripts/seed.js          ← Database seeding script
├── data/                    ← Seed data and sample uploads
└── .env.example             ← Template for environment variables

icsscentral-website/         ← React Frontend
├── src/
│   ├── app/
│   │   ├── components/      ← Shared UI components (Layout, banners, etc.)
│   │   └── pages/           ← One file per route/page
│   ├── lib/                 ← API clients and utilities
│   │   ├── strapiApi.ts     ← All Strapi REST API calls
│   │   ├── supabase.ts      ← Supabase client
│   │   ├── cloudinary.ts    ← Cloudinary helper
│   │   ├── env.ts           ← Environment variable validation
│   │   └── sanitize.ts      ← HTML sanitization (DOMPurify)
│   └── assets/              ← Static images and icons
├── guidelines/Guidelines.md ← Developer guidelines
└── netlify.toml             ← Netlify deployment config
```

---

## Quick Start

> **Prerequisites:** Node.js ≥ 20, npm ≥ 6, a PostgreSQL database, and accounts for Cloudinary, SendGrid, Supabase (see [External Services](#external-services)).

### 1 — Clone both repositories

```bash
git clone https://github.com/YOUR_ORG/ICSSC-Central-Backend.git
git clone https://github.com/YOUR_ORG/icsscentral-website.git
```

### 2 — Set up the Backend

```bash
cd ICSSC-Central-Backend
npm install

# Copy and fill in environment variables
cp .env.example .env
# Edit .env with your actual values (see Environment Variables section)

# Start development server (auto-reload enabled)
npm run dev
```

The Strapi admin panel will be available at `http://localhost:1337/admin`.

On first run, Strapi will prompt you to create an **admin account**. Use a shared organizational email (e.g., `ust.icssc.noreply@gmail.com`) so access is not tied to one person.

### 3 — Seed sample data (optional)

```bash
npm run seed:example
```

This populates the database with sample articles, authors, and global settings. Only runs once — re-running after initial data exists will be skipped.

### 4 — Set up the Frontend

```bash
cd ../icsscentral-website
npm install

# Create .env file
cp .env .env.local  # or create manually
# Fill in env vars (see Environment Variables section)

# Start development server
npm run dev
```

The website will be available at `http://localhost:5173`.

---

## Environment Variables

### Backend — `.env`

```env
# Server
HOST=0.0.0.0
PORT=1337

# Security keys — generate unique random strings for production
APP_KEYS="randomKey1,randomKey2"
API_TOKEN_SALT=randomSaltValue
ADMIN_JWT_SECRET=randomAdminSecret
TRANSFER_TOKEN_SALT=randomTransferSalt
JWT_SECRET=randomJwtSecret
ENCRYPTION_KEY=randomEncryptionKey

# PostgreSQL Database
DATABASE_CLIENT=postgres
DATABASE_HOST=your-db-host
DATABASE_PORT=5432
DATABASE_NAME=your-db-name
DATABASE_USERNAME=your-db-user
DATABASE_PASSWORD=your-db-password
DATABASE_SSL=true

# Or use a full connection string (Railway/Supabase style)
DATABASE_URL=postgresql://user:password@host:port/dbname

# Cloudinary (Media uploads)
CLOUDINARY_NAME=your_cloud_name
CLOUDINARY_KEY=your_api_key
CLOUDINARY_SECRET=your_api_secret

# SendGrid (Email)
SENDGRID_API_KEY=SG.your_sendgrid_key
```

> ⚠️ **Never commit `.env` to Git.** The `.gitignore` already excludes it, but double-check before pushing.

### Frontend — `.env`

```env
# Strapi Backend URL (no trailing slash)
VITE_STRAPI_URL=https://your-backend.up.railway.app

# Strapi API Token (generate in Strapi Admin → Settings → API Tokens)
VITE_STRAPI_TOKEN=your_full_api_token_here

# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Cloudinary
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
```

---

## Content Types (Data Models)

These are all managed through the **Strapi Admin Panel** at `/admin`.

### `Article` (Collection)
Blog posts and news items displayed on the Blogs section.

| Field | Type | Notes |
|---|---|---|
| `coverImage` | Media | Featured image |
| `post_category` | Enum | `Student Spotlight`, `Community Development`, `Opportunities` |
| `post_title` | String | Article headline |
| `post_author` | String | Author name (free text) |
| `postDate` | Datetime | Publication date |
| `post_content` | Rich Text | Full article body |

Draft/publish workflow is **enabled** — articles must be explicitly published.

---

### `Author` → displayed as "Council Members" (Collection)
Current council members shown on the Members page.

| Field | Type | Notes |
|---|---|---|
| `member_name` | String | Full name |
| `member_position` | String | e.g., "President", "Secretary" |
| `member_image` | Media | Profile photo |
| `member_group` | Enum | `Adviser`, `Executive Board`, `Executive Staff`, `Board of Representatives` |
| `member_order` | Integer | Controls display order (lower = first) |

---

### `Event` (Collection)
Events displayed on the Events page.

| Field | Type | Notes |
|---|---|---|
| `title` | String | Event name |
| `slug` | UID | Auto-generated from title |
| `date` | Datetime | Event date and time |
| `content` | Blocks | Rich content body |
| `image` | Media | Event banner/photo |
| `externalLink` | String | Optional link (e.g., registration form) |
| `category` | Enum | `Academic`, `Career`, `Community`, `Celebration`, `Sports` |

---

### `FOI-Request` (Collection)
Freedom of Information requests submitted via the FOI Portal.

| Field | Type | Notes |
|---|---|---|
| `foi_title` | String | Request title |
| `refId` | String | Reference ID |
| `trackingNo` | String | Tracking number for the requester |
| `foi_status` | Enum | `successful`, `pending`, `denied` |
| `publishedDate` | Date | Date of submission |
| `requestedBy` | String | Requester name |
| `foi_affiliation` | Enum | `UST Student`, `UST Faculty/Staff`, `Alumni`, `Organization`, `External (Non-thomasian)` |
| `foi_category` | Enum | `Academic`, `Financial`, `Facilities`, `Events`, `Others` |
| `foi_purpose` | Text | Purpose of the request |
| `foi_email` | String | Requester email |
| `supportingDoc` | Media | Uploaded supporting document |
| `denialReason` | Text | Reason (if denied) |
| `statusLog` | Component (repeatable) | Timeline of status changes |

---

### `Inquiry` (Collection)
Contact form submissions from the Contact page.

| Field | Type | Notes |
|---|---|---|
| `fullName` | String | Sender's full name |
| `inquiry_email` | String | Sender's email |
| `inquiry_org` | String | Sender's organization |
| `inquiry_subject` | String | Subject |
| `inquiry_message` | Text | Message body |
| `inquiry_status` | Enum | `New`, `Reviewed`, `Resolved` |
| `adminReply` | Text | Officer's reply |
| `repliedAt` | Datetime | When it was replied |

---

### `Organization` (Collection)
CICS orgs and partner organizations shown on the Organizations page.

| Field | Type | Notes |
|---|---|---|
| `partner_name` | String | Organization name |
| `partner_image` | Media | Organization logo |
| `partner_desc` | Text | Short description |
| `websiteUrl` | String | Link to their website |
| `partner_type` | Enum | `CICS Organizations`, `Partner`, `Sponsor` |

---

### `Program` (Collection)
Academic programs listed in the Directory.

| Field | Type | Notes |
|---|---|---|
| `pogram_title` | String | Program name (note: typo in field name, do not rename) |
| `program_link` | String | URL to more info |
| `program_order` | Integer | Display order |

---

### `Global` (Single Type)
Site-wide settings (site name, description, SEO defaults).

### `About` (Single Type)
About section content.

---

## Website Pages & Features

| URL | Page | Description |
|-----|------|-------------|
| `/` | Home | Landing page with hero, highlights, and featured content |
| `/events` | Events | Upcoming and past events fetched from Strapi |
| `/blogs` | Blogs | All articles; sub-routes for Partnership and Legacy categories |
| `/blogs/:id` | Blog Post | Individual article view |
| `/services/foi-portal` | FOI Portal | Submit and track Freedom of Information requests |
| `/services/straw-desk` | STRAW Desk | Student Rights, Academic, and Welfare Desk info and QR code |
| `/services/directory` | Directory | Academic program directory |
| `/about/council` | Council History | History of the council |
| `/about/members` | Council Members | Current officers by group |
| `/about/organizations` | Organizations | CICS orgs, partners, sponsors |
| `/contact` | Contact | Contact form that submits inquiries to Strapi |

---

## External Services

### Railway (Backend Hosting)
The Strapi backend is hosted on [Railway](https://railway.app). The current production URL is `icssc-central-backend-production.up.railway.app`.

- Access: Invite new officers to the Railway project
- Database: PostgreSQL instance is also on Railway
- Logs and deployments are managed via the Railway dashboard

### Netlify (Frontend Hosting)
The React frontend is deployed on [Netlify](https://netlify.com). Deployments trigger automatically on pushes to the main branch.

- The `netlify.toml` configures the build command (`npm run build`) and publish directory (`dist`)
- The SPA redirect rule (`/* → /index.html`) ensures React Router works correctly

### Cloudinary (Media Storage)
All images and media files uploaded through the Strapi admin are stored in [Cloudinary](https://cloudinary.com). The frontend also uses the Cloudinary cloud name to construct image URLs.

- Cloud name: stored in both `.env` files
- Manage media at `cloudinary.com/console`

### Supabase (Auth + Database)
[Supabase](https://supabase.com) is used for supplemental database and auth features on the frontend.

- Project URL and anon key are in the frontend `.env`
- Access the Supabase dashboard to manage data and auth settings

### SendGrid (Email)
Transactional emails (e.g., inquiry confirmations) are sent via [SendGrid](https://sendgrid.com) using the configured API key.

- Default sender: `ust.icssc.noreply@gmail.com`

---

## Deployment

### Backend — Railway

```bash
# Build the admin panel first
npm run build

# Deploy (if using Railway CLI)
railway up

# Or push to GitHub — Railway auto-deploys from the connected branch
git push origin main
```

### Frontend — Netlify

```bash
# Build for production
npm run build
# Output goes to /dist

# Netlify auto-deploys on git push to the connected branch
git push origin main
```

To manually deploy:
```bash
# Install Netlify CLI if needed
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

---

## Officer Handover Checklist

When transitioning to a new set of officers, complete the following:

### Accounts & Access
- [ ] Add new officers to the **GitHub organization/repos** with appropriate roles
- [ ] Invite new officers to the **Railway project** (for backend management)
- [ ] Add new officers to the **Netlify team**
- [ ] Share access to the **Cloudinary account**
- [ ] Share access to the **Supabase project**
- [ ] Share access to the **SendGrid account**
- [ ] Transfer credentials for `ust.icssc.noreply@gmail.com`

### Strapi Admin
- [ ] Create new **admin accounts** for incoming officers in Strapi Admin → Administration → Users
- [ ] Deactivate or delete outgoing officer admin accounts
- [ ] Rotate **API tokens** (Settings → API Tokens) and update the frontend `.env`
- [ ] Rotate all **secret keys** in the backend `.env` (APP_KEYS, JWT_SECRET, etc.)

### Environment Variables
- [ ] Update `VITE_STRAPI_TOKEN` in Netlify's environment settings after rotating the API token
- [ ] Review all env vars are current and valid

### Content
- [ ] Update **Council Members** (`/about/members`) in Strapi — remove outgoing officers, add incoming ones with correct `member_group` and `member_order`
- [ ] Archive or unpublish outdated **Events**
- [ ] Review pending **FOI Requests** and **Inquiries** and transition ownership

### Documentation
- [ ] Update this README if any infrastructure changes were made
- [ ] Review the `guidelines/Guidelines.md` in the frontend repo

---

## Contributing Guidelines

1. **Branch naming:** `feature/short-description`, `fix/short-description`, `chore/short-description`
2. **Never push directly to `main`.** Open a pull request and request a review.
3. **Environment variables** must never be committed. Use `.env.example` to document new vars.
4. **Content type changes** made via the Strapi UI are automatically written to `src/api/*/content-types/*/schema.json` — commit these files.
5. **Media files** are stored in Cloudinary, not in the repository.
6. When adding a new page to the frontend, register its route in `src/app/routes.ts`.

---

*Built with ❤️ by the ICSSC Web Development Team — UST College of Information and Computing Sciences*
