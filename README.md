# Fundraising Operations Platform

Full-stack platform for fundraising campaigns, donor engagement, contacts, and automated communications, including public campaign pages.

## Overview

This application is built with TypeScript across web and API layers:

- **Frontend:** Angular 18 with Angular Material, Bootstrap, SSR, JWT authentication, and rich-text email templates.
- **Backend:** Node.js, Express, and TypeScript with MongoDB, JWT authentication, file uploads, and optional payment and email integrations.

## Features

- Organizations, companies, groups, users, and role-based access
- Campaigns with public fundraising pages
- Contacts, contact groups, vendors, and products
- Email templates and drip campaigns
- Donations and payment-provider hooks
- Master data for countries, states, regions, and email types
- Profile management and branded group/organization assets

## Project structure

```text
.
├── backend/     # Express API (TypeScript)
└── frontend/    # Angular 18 web app
```

## Prerequisites

- Node.js 18 or later
- npm
- MongoDB 6 or later
- Optional: SMTP/SendGrid and payment-gateway credentials

## Getting started

### 1. Backend

```bash
cd backend
cp config/config.example.ts config/config.ts
npm install
npm run dev
```

The API starts on `http://localhost:3000`. Configure MongoDB, JWT secrets, and optional payment keys in `backend/config/config.ts`.

### 2. Frontend

```bash
cd frontend
npm install
npm start
```

The Angular app starts on `http://localhost:4200` and proxies `/api/` and `/files/` to the backend.

Public fundraising pages are available at:

```text
/campaign-progress/:campaignId/fund-raising/:studentId
```

## Configuration

| Setting | Purpose |
| --- | --- |
| `secret` / `refreshTokenSecret` | JWT signing secrets |
| `db` | MongoDB connection |
| `authorized_payment` | Payment gateway credentials |
| `image_space` | Object-storage credentials for uploads |
| `sendEmails` | Enable or disable outbound email |

Uploaded logos and profile images under `backend/files/` are gitignored.

## Scripts

| Location | Command | Description |
| --- | --- | --- |
| backend | `npm run dev` | Start the API with live reload |
| backend | `npm run build` | Compile TypeScript |
| backend | `npm run lint` | Run ESLint |
| frontend | `npm start` | Serve the Angular app with proxy |
| frontend | `npm run build` | Production build |

## Security notes

- Runtime config, environment files, uploads, and temp files are gitignored
- Keep payment keys and SMTP passwords out of source control
