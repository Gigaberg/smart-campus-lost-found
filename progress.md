# 📋 Project Log Book & System Architecture — Smart Campus Lost & Found

> [!IMPORTANT]
> ### 🤖 MANDATORY AI INSTRUCTION FOR ALL AI CODING ASSISTANTS
> **STOP AND READ BEFORE MAKING ANY CHANGES:**
> 1. **ALWAYS READ THIS FILE FIRST:** Any AI assistant working on this repository MUST read this `progress.md` file before inspecting or editing other files. It contains the exact technical architecture, operational quirks, and established conventions of this codebase.
> 2. **ALWAYS UPDATE THIS LOG BOOK BEFORE & AFTER EDITING:** Whenever you plan to make, or have made, any file changes, bug fixes, refactoring, or feature additions, you **MUST update this file** and append an entry to the [Project Change Log & Work History](#-5-project-change-log--work-history) section at the bottom of this file.
> 3. Document: Date, Files Modified, What Changed, and Technical Rationale. This prevents future AI sessions from repeating past mistakes or having to read through hundreds of files to understand the system state.

---

## 🏗️ 1. System Architecture Overview

Smart Campus Lost & Found is a full-stack platform designed for university campuses to report, search, track, and match lost and found belongings with automated candidate suggestion algorithms, authenticated user claiming, image uploads, and in-app communication.

```
smart-campus-lost-found/
├── backend/                         # Express.js & Node.js REST API Backend
│   ├── server.js                    # Server startup, port listening, MongoDB connection
│   ├── package.json                 # Express, Mongoose, JWT, Multer, bcryptjs, cors
│   ├── .env                         # Environment variables (PORT, MONGO_URI, JWT_SECRET)
│   ├── uploads/                     # Statically served local disk upload directory
│   └── src/
│       ├── app.js                   # Express application setup, middleware, routing
│       ├── config/                  # Database connection configuration (db.js)
│       ├── controllers/
│       │   ├── authController.js    # Registration, login, password hashing, JWT minting
│       │   ├── itemController.js    # CRUD items, filter/search, claim status update
│       │   └── messageController.js # Direct messaging between finder and claimant
│       ├── middleware/
│       │   ├── auth.js              # Bearer token JWT verification middleware
│       │   └── upload.js            # Multer disk storage and file extension filter
│       ├── models/
│       │   ├── User.js              # User schema (name, email, password, avatar, role)
│       │   ├── Item.js              # Item schema (title, desc, category, status, location, images, user)
│       │   └── Message.js           # Message schema (conversation threads, sender, recipient, body)
│       ├── routes/
│       │   ├── auth.js              # /api/auth routes
│       │   ├── items.js             # /api/items routes
│       │   └── messages.js          # /api/messages routes
│       └── services/
│           └── matchingService.js   # Automated similarity matching between lost & found items
│
├── frontend/                        # React + Vite Client Application
│   ├── index.html                   # HTML template
│   ├── vite.config.js               # Vite build configuration and proxy rules
│   ├── package.json                 # React 18, React Router DOM, Axios, Lucide icons
│   └── src/
│       ├── main.jsx                 # React root mount
│       ├── App.jsx                  # Main router definitions and layout wrappers
│       ├── api/                     # Axios HTTP client instances with auth interceptors
│       ├── components/              # Navbar, Footer, ItemCard, ProtectedRoute
│       ├── context/                 # AuthContext (user session, token storage)
│       └── pages/                   # HomePage, CreateItemPage, EditItemPage, ItemDetailPage,
│                                    # InboxPage, ProfilePage, LoginPage, RegisterPage
│
├── build.sh                         # Monorepo build script for Render / deployment
├── render.yaml                      # Render cloud deployment blueprint
└── progress.md                      # THIS FILE — Persistent system logbook & AI context
```

### Quick Commands
- **Backend API (Port 5000):**
  ```powershell
  cd backend
  npm install
  npm run dev   # or: node server.js
  ```
- **Frontend App (Port 5173):**
  ```powershell
  cd frontend
  npm install
  npm run dev
  ```
- **Full Monorepo Build:**
  ```powershell
  bash build.sh
  ```

---

## 🧠 2. Core Functional Logic & Data Flow

### A. Item Lifecycle & Statuses
Items are stored in MongoDB with states:
- `lost`: Reported lost by an owner.
- `found`: Reported found by a student/staff member.
- `claimed`: Verification completed and returned to verified owner.
- `archived`: Resolved or expired.

### B. Automated Match Engine (`backend/src/services/matchingService.js`)
When an item is posted:
1. The engine checks items of the complementary type (`lost` $\leftrightarrow$ `found`).
2. Filters by matching `category` (e.g., Electronics, Keys, Wallets, IDs, Books).
3. Evaluates campus location proximity and date ranges.
4. Performs case-insensitive keyword intersection on title and description.
5. Emits potential candidate matches to both finder and reporter to expedite recovery.

### C. Authentication & Access Control
- JWT tokens with 7-day expiration are stored in `localStorage` on the frontend.
- `auth` middleware extracts `Bearer <token>` from the HTTP `Authorization` header, decodes user payload, and attaches `req.user`.
- Modifying or deleting an item requires ownership or administrative privileges.

---

## 📌 3. Key Domain Insights & Operational Gotchas

1. **Static Uploads vs Ephemeral Cloud Filesystems:**
   - In local development, uploaded images are stored on local disk under `backend/uploads/` and served statically via Express. On cloud platforms with ephemeral disks (such as free Render instances), uploads will be wiped on restart unless migrated to S3/Cloudinary.
2. **CORS & Proxying:**
   - Frontend development server communicates with backend via Axios baseURL. Ensure `CORS_ORIGIN` matches Vite's origin (`http://localhost:5173`) in development.
3. **Mongoose ObjectId Comparisons:**
   - Always use `.equals()` or convert to string (`user._id.toString() === item.user.toString()`) when checking ownership in controllers to avoid JS object reference mismatch bugs.

---

## 🔌 4. API Endpoints Reference (`backend/src/routes/`)

### Authentication (`/api/auth`)
- `POST /register`: Register student account with name, campus email, password.
- `POST /login`: Validate credentials and issue JWT.
- `GET /me`: Fetch authenticated user profile.

### Items (`/api/items`)
- `GET /`: Search and list items with query filters (`type`, `category`, `search`, `status`).
- `POST /`: Create item with multipart/form-data image attachment (Protected).
- `GET /:id`: Retrieve item details and suggested matching candidate items.
- `PUT /:id`: Update item details or mark status as `claimed` (Protected).
- `DELETE /:id`: Delete item (Protected).

### Messages (`/api/messages`)
- `GET /`: List conversation threads for current user.
- `GET /:conversationId`: Retrieve message history between two users regarding an item.
- `POST /`: Send message regarding a lost/found listing.

---

## 📝 5. Project Change Log & Work History

> **RULE FOR AI ASSISTANTS:** When you make changes, append a new log entry below with date, summary, files modified, and rationale.

### Entry: 2026-10-01 — System Architecture Documentation & AI Logbook Initialization
- **Author / Agent:** Antigravity (Gemini 3.8 Flash)
- **Files Modified / Created:**
  - `progress.md`: Created centralized logbook with system architecture, data models, matching engine details, and mandatory agent guidelines.
- **Rationale:** Standardized documentation across repositories to provide instant architectural context for pair programming and agentic workflows.
