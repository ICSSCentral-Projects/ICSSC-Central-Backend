# 📖 ICSSC Central — Officer How-To Guide

> **Who this is for:** Incoming ICSSC officers who will manage the council website. No deep programming knowledge is required for day-to-day tasks. This guide walks through the most common operations step by step.

---

## Table of Contents

1. [Getting Access](#1-getting-access)
2. [Accessing the Strapi Admin Panel](#2-accessing-the-strapi-admin-panel)
3. [Managing Council Members](#3-managing-council-members)
4. [Publishing Events](#4-publishing-events)
5. [Writing and Publishing Blog Articles](#5-writing-and-publishing-blog-articles)
6. [Handling FOI Requests](#6-handling-foi-requests)
7. [Handling Contact Inquiries](#7-handling-contact-inquiries)
8. [Managing Organizations & Partners](#8-managing-organizations--partners)
9. [Managing Programs (Directory)](#9-managing-programs-directory)
10. [Rotating API Tokens & Secrets (Security)](#10-rotating-api-tokens--secrets-security)
11. [Running the Project Locally (For Developers)](#11-running-the-project-locally-for-developers)
12. [Deploying Updates](#12-deploying-updates)
13. [Troubleshooting Common Issues](#13-troubleshooting-common-issues)

---

## 1. Getting Access

Before you can do anything, you need access to the following services. Ask your predecessor or the outgoing technical officer to invite you.

| Service | What it's for | Where to access |
|---------|--------------|-----------------|
| GitHub | Source code | github.com — ask to be added to the org |
| Railway | Backend hosting + database | railway.app — ask for project invite |
| Vercel | Frontend hosting | vercel.com — ask for team invite |
| Cloudinary | Image/media storage | cloudinary.com — ask for account credentials |
| Supabase | Auth & supplemental DB | supabase.com — ask for project invite |
| SendGrid | Email sending | sendgrid.com — ask for account credentials |
| Strapi Admin | Content management | Visit your production backend URL + `/admin` |

> 💡 **Tip:** Keep a shared password manager (e.g., Bitwarden) for the organization so credentials don't get lost between batches of officers.

---

## 2. Accessing the Strapi Admin Panel

The Strapi Admin Panel is the main interface you will use for all content management. You do not need to touch any code for most tasks.

### Production Admin Panel

1. Go to your backend URL in the browser:
   ```
   https://icssc-central-backend-production.up.railway.app/admin
   ```
2. Log in with your admin credentials.
3. If you don't have an account yet, ask a current admin to create one for you at **Settings → Administration → Users → Invite new user**.

### What you'll see

The left sidebar has these main sections:

- **Content Manager** — Where you create, edit, and publish all content
- **Media Library** — Where uploaded images and files are stored
- **Settings** — Where you manage users, roles, API tokens, and other configurations

---

## 3. Managing Council Members

Council Members are stored under the **"Author"** content type in Strapi (it was originally named Author and repurposed). They appear on the `/about/members` page.

### Adding a New Member

1. In the Strapi Admin, go to **Content Manager → Council Members**
2. Click **"Create new entry"**
3. Fill in the fields:
   - **member_name** — Full name (e.g., `Juan dela Cruz`)
   - **member_position** — Their role (e.g., `President`, `VP for Finance`, `Representative`)
   - **member_image** — Upload a profile photo (square photos work best)
   - **member_group** — Select from:
     - `Adviser`
     - `Executive Board`
     - `Executive Staff`
     - `Board of Representatives`
   - **member_order** — A number that controls their position in the list. Lower numbers appear first. Use `1` for the President, `2` for VP, etc.
4. Click **"Save"** — note this content type does NOT use draft/publish (it goes live immediately on save)

### Updating a Member

1. Go to **Content Manager → Council Members**
2. Click on the member's name
3. Edit the relevant fields
4. Click **"Save"**

### Removing an Outgoing Officer

1. Go to **Content Manager → Council Members**
2. Click on the member's name
3. Click the **"Delete"** button (usually in the top right area or via the "..." menu)
4. Confirm deletion

> ⚠️ Deleting a member is permanent. If you want to keep a historical record, consider keeping them but updating their `member_group` to a custom label before a full transition.

---

## 4. Publishing Events

Events appear on the `/events` page. They support a draft/publish workflow — you can save a draft without it going public.

### Creating an Event

1. Go to **Content Manager → Event**
2. Click **"Create new entry"**
3. Fill in the fields:
   - **title** — Event name
   - **date** — Date and time of the event
   - **category** — `Academic`, `Career`, `Community`, `Celebration`, or `Sports`
   - **image** — Upload an event banner or photo
   - **content** — Full description using the block editor (supports headings, lists, links, images)
   - **externalLink** — Optional: a registration form or external link (include `https://`)
4. To save as a draft: click **"Save"**
5. To make it live on the website: click **"Publish"**

### Editing an Existing Event

1. Go to **Content Manager → Event**
2. Click on the event title
3. Make your changes
4. Click **"Save"** (draft) or **"Publish"** (live)

### Unpublishing a Past Event

1. Go to **Content Manager → Event**
2. Click on the event
3. Click **"Unpublish"** — it will no longer appear on the website but the data is preserved

---

## 5. Writing and Publishing Blog Articles

Articles appear on the `/blogs` page and individual article pages at `/blogs/:id`.

### Creating an Article

1. Go to **Content Manager → Article**
2. Click **"Create new entry"**
3. Fill in the fields:
   - **coverImage** — Upload a featured image for the post
   - **post_category** — `Student Spotlight`, `Community Development`, or `Opportunities`
   - **post_title** — Headline of the article
   - **post_author** — Author's name (free text)
   - **postDate** — The date to display on the article
   - **post_content** — Full article body (supports rich text: headings, bold, italic, links, images)
4. Save as draft or publish when ready

### Writing Tips

- Keep titles concise and descriptive
- Use headings (H2, H3) in the body to break up long articles
- Always add a cover image — articles without images may look incomplete on the website
- Proofread before publishing — once published, it's live immediately

---

## 6. Handling FOI Requests

The FOI (Freedom of Information) Portal at `/services/foi-portal` allows students and the public to submit information requests. Submissions are stored in Strapi under **FOI-Request**.

### Viewing Submitted Requests

1. Go to **Content Manager → FOI-Request**
2. You'll see a list of all submitted requests with their status

### Processing a Request

1. Click on a request to open it
2. Review the fields:
   - **foi_title** — What was requested
   - **requestedBy** / **foi_email** — Who submitted it
   - **foi_affiliation** — Their relationship to the university
   - **foi_purpose** — Why they're requesting the information
   - **supportingDoc** — Any document they attached
3. Update the **foi_status** field:
   - `pending` — Still being processed
   - `successful` — Request has been fulfilled
   - `denied` — Request was denied (fill in the **denialReason** field)
4. Add entries to the **statusLog** component to create a timeline visible to the requester
5. Click **"Save"** and then **"Publish"** to make the status update visible on the portal

> 📌 The public FOI portal only shows **published** entries. Keep entries in draft until they're ready to be made public.

### FOI Best Practices

- Assign a **trackingNo** when the request comes in (e.g., `FOI-2025-001`)
- Update the **statusLog** whenever the status changes so requesters can track progress
- Always fill in **denialReason** when denying a request — this is required for transparency
- If a request involves sensitive information, consult with the council adviser before publishing

---

## 7. Handling Contact Inquiries

When someone submits the contact form at `/contact`, it creates a new entry under **Inquiry** in Strapi.

### Viewing Inquiries

1. Go to **Content Manager → Inquiry**
2. New submissions will have `inquiry_status = New`

### Responding to an Inquiry

1. Click on the inquiry
2. Review the message details
3. Reply to the person directly at their **inquiry_email** address (outside of Strapi — use your council email)
4. After replying, update the record:
   - **adminReply** — Paste or summarize your reply
   - **repliedAt** — Set the datetime of your reply
   - **inquiry_status** — Change to `Reviewed` or `Resolved`
5. Click **"Save"**

### Inquiry Status Guide

| Status | Meaning |
|--------|---------|
| `New` | Just submitted, hasn't been read yet |
| `Reviewed` | Has been read; follow-up may be needed |
| `Resolved` | Fully addressed and closed |

---

## 8. Managing Organizations & Partners

Organizations and partners are shown at `/about/organizations`.

### Adding an Organization

1. Go to **Content Manager → Organization**
2. Click **"Create new entry"**
3. Fill in:
   - **partner_name** — Organization name
   - **partner_image** — Their logo
   - **partner_desc** — Short description (2–3 sentences)
   - **websiteUrl** — Their website URL (include `https://`)
   - **partner_type** — `CICS Organizations`, `Partner`, or `Sponsor`
4. Save and Publish

### Removing an Organization

Follow the same deletion process as with council members. Consider unpublishing instead of deleting if you might want to reinstate them later.

---

## 9. Managing Programs (Directory)

The academic programs in the `/services/directory` page are managed under the **Program** content type.

### Adding a Program

1. Go to **Content Manager → Program**
2. Click **"Create new entry"**
3. Fill in:
   - **pogram_title** — Program name *(note: this field has a typo — "pogram" — do not rename it)*
   - **program_link** — URL to more info (e.g., UST's official page for that program)
   - **program_order** — Display order (lower = first)
4. Save and Publish

---

## 10. Rotating API Tokens & Secrets (Security)

API tokens and secret keys should be rotated when a new set of officers takes over. This ensures outgoing members no longer have access.

### Rotating the Strapi API Token

This token is used by the frontend to authenticate its requests to the backend.

1. In Strapi Admin, go to **Settings → API Tokens**
2. Click on the existing token
3. Click **"Regenerate"** or delete and create a new one with the same permissions (Full Access)
4. Copy the new token
5. Update `VITE_STRAPI_TOKEN` in:
   - Vercel: Site settings → Environment variables → update `VITE_STRAPI_TOKEN`
   - Your local `.env` file in `icsscentral-website/`
6. Trigger a new deployment on Vercel so the new token takes effect

### Rotating Backend Secret Keys

1. In the backend `.env` file (on Railway or your server), update:
   - `APP_KEYS` — Replace with two new random strings
   - `API_TOKEN_SALT`
   - `ADMIN_JWT_SECRET`
   - `JWT_SECRET`
   - `ENCRYPTION_KEY`

   You can generate secure random strings at [generate.plus/en/base64](https://generate.plus/en/base64) or using:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
   ```
2. Restart the Strapi server after updating the `.env`

> ⚠️ After rotating `ADMIN_JWT_SECRET`, all admin users will be logged out and will need to log in again.

### Revoking Old Admin Accounts

1. Go to **Settings → Administration → Users**
2. Click on an outgoing officer's account
3. Click **"Delete"** to remove their access

---

## 11. Running the Project Locally (For Developers)

This section is for officers handling web development.

### Prerequisites

- Node.js version 20 or higher (`node --version` to check)
- npm version 6 or higher (`npm --version` to check)
- Access to a PostgreSQL database (use Railway's connection string or set up a local one)
- Valid credentials for Cloudinary, Supabase, and SendGrid

### Backend Setup

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_ORG/ICSSC-Central-Backend.git
cd ICSSC-Central-Backend

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Open .env in a text editor and fill in all values

# 4. Start the dev server
npm run dev
# Admin panel: http://localhost:1337/admin
```

### Frontend Setup

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_ORG/icsscentral-website.git
cd icsscentral-website

# 2. Install dependencies
npm install

# 3. Set up environment variables
# Create a .env file (there is no .env.example — copy from the shared credentials doc)
# Fill in:
# VITE_STRAPI_URL=http://localhost:1337   (point to local backend during development)
# VITE_STRAPI_TOKEN=your_token
# VITE_SUPABASE_URL=...
# VITE_SUPABASE_ANON_KEY=...
# VITE_CLOUDINARY_CLOUD_NAME=...

# 4. Start the dev server
npm run dev
# Website: http://localhost:5173
```

### Building for Production

```bash
# Frontend
npm run build
# Output is in /dist

# Backend
npm run build   # Builds the Strapi admin panel
```

---

## 12. Deploying Updates

### Frontend Deployment (Vercel)

Vercel is connected to the GitHub repository. Deployments are automatic:

1. Push your changes to the `main` branch on GitHub
2. Vercel detects the push and starts building automatically
3. Monitor the build in the Vercel dashboard under **Deploys**
4. Once the build completes (usually 1–3 minutes), the site is live

To manually trigger a deploy without code changes:
- Vercel dashboard → **Deploys** → **Trigger deploy** → **Deploy site**

### Backend Deployment (Railway)

Railway also auto-deploys from GitHub:

1. Push changes to the `main` branch of the backend repo
2. Railway detects the push and redeploys automatically
3. Monitor in the Railway dashboard under **Deployments**

For environment variable changes:
- Railway dashboard → Your project → **Variables** tab → Update values → Railway will restart the service automatically

---

## 13. Troubleshooting Common Issues

### The website shows old content / changes aren't reflecting

- **Most likely cause:** The browser or CDN is caching the old content
- **Fix:** Hard refresh (`Ctrl + Shift + R` or `Cmd + Shift + R`). If the issue persists on multiple devices, trigger a new Vercel deployment (Vercel dashboard → Deploys → Trigger deploy)

### A new Council Member isn't showing on the website

- **Check 1:** Is the entry saved in Strapi? Go to Content Manager → Council Members and confirm it's there
- **Check 2:** This content type does not use draft/publish — it goes live on save. If it's saved but not showing, check if `member_group` is filled in correctly
- **Check 3:** Clear your browser cache

### An event is not showing up / is showing as expired

- **Check:** Confirm the entry is **Published** (not Draft) in Strapi
- **Check:** Confirm the `date` field is set correctly. The frontend may filter out past events

### The contact form isn't submitting

- **Check:** The Strapi backend must be running and reachable
- **Check:** Confirm `VITE_STRAPI_URL` and `VITE_STRAPI_TOKEN` in the Vercel environment variables are correct and up to date
- **Developer fix:** Open the browser console (F12 → Console) and look for error messages when submitting the form

### Strapi admin won't log in / shows "invalid credentials"

- **If you just rotated `ADMIN_JWT_SECRET`:** All sessions were invalidated. Log in with your email and password again
- **If you forgot your password:** Use the "Forgot password?" link on the admin login page (email must be configured via SendGrid)
- **If SendGrid is broken:** A developer can reset passwords directly in the database — contact your tech officer

### Images not loading on the website

- **Check:** Cloudinary credentials in the backend `.env` (`CLOUDINARY_NAME`, `CLOUDINARY_KEY`, `CLOUDINARY_SECRET`)
- **Check:** `VITE_CLOUDINARY_CLOUD_NAME` in the frontend `.env`
- **Check:** The image was actually uploaded via Strapi (not just saved as a URL). Open the Media Library in Strapi to confirm the file is there

### Railway deployment failed

- In Railway dashboard, click on the failed deployment to see logs
- Common causes: missing environment variable, build error, database connection issue
- Check that all required `.env` variables are set in the Railway **Variables** tab

### "Missing required environment variable" error on the website

- The frontend validates required env vars on startup
- **Fix:** Check Vercel → Site settings → Environment variables and ensure all required vars (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_STRAPI_URL`) are present
- Trigger a new deployment after updating

---

## Quick Reference Card

| Task | Where |
|------|-------|
| Add/update council members | Strapi Admin → Content Manager → Council Members |
| Create an event | Strapi Admin → Content Manager → Event |
| Write a blog post | Strapi Admin → Content Manager → Article |
| Review FOI requests | Strapi Admin → Content Manager → FOI-Request |
| Respond to contact inquiries | Strapi Admin → Content Manager → Inquiry |
| Add a partner org | Strapi Admin → Content Manager → Organization |
| Upload media/images | Strapi Admin → Media Library |
| Manage admin users | Strapi Admin → Settings → Administration → Users |
| Rotate API token | Strapi Admin → Settings → API Tokens |
| View deployment logs | Vercel dashboard (frontend) / Railway dashboard (backend) |
| Update environment variables | Vercel → Site settings → Env vars (frontend) / Railway → Variables (backend) |

---

*For questions not covered here, refer to the [main README](./README.md) or reach out to the previous technical officer. Keeping this document updated with every batch is key to long-term sustainability. 🙏*
