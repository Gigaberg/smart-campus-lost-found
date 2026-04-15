# Smart Campus Lost & Found

A full-stack web app for reporting and recovering lost items on campus.

## Stack
- **Frontend**: React + Vite + Tailwind CSS + React Router
- **Backend**: Node.js + Express + MongoDB (Mongoose)
- **Auth**: JWT + bcrypt

## Setup

### Prerequisites
- Node.js 18+
- MongoDB running locally (or update `MONGO_URI` in `.env`)

### Backend
```bash
cd backend
# Edit .env with your MONGO_URI and JWT_SECRET
npm run dev
```
Runs on http://localhost:5000

### Frontend
```bash
cd frontend
npm run dev
```
Runs on http://localhost:5173 (proxies `/api` to backend)

## Features
- Register / Login with JWT auth
- Post lost or found items with optional image upload
- Search & filter by type, category, keyword, location
- Automatic matching suggestions between lost ↔ found posts
- In-app messaging to contact item posters
- Status management (active → recovered / claimed)
- Responsive mobile-friendly UI
