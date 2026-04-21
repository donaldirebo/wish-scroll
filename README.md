# WishScroll 🌀

A TikTok-style content feed app where users swipe through curated video content, react to posts, upload personal media, and share collections with others. Built as a full-stack web and Android application.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
  - [1. Clone the Repository](#1-clone-the-repository)
  - [2. Backend Setup](#2-backend-setup)
  - [3. Frontend Setup](#3-frontend-setup)
  - [4. Running the App](#4-running-the-app)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Database Models](#database-models)
- [YouTube Content Setup](#youtube-content-setup)
- [Android Build](#android-build)
- [Known Issues & Fixes](#known-issues--fixes)
- [Contributing (Git Workflow)](#contributing-git-workflow)
- [Team](#team)

---

## Features

- **Swipeable Content Feed** — Swipe through YouTube videos and images by category (Animals, Sports, Art, Funny, etc.)
- **User Authentication** — Register and log in with email and password (JWT tokens)
- **Interactions** — Like, dislike, and save posts; dwell-time tracking per post
- **Personal Media** — Upload your own photos and videos (up to 20MB)
- **Favourites** — View all your saved posts in one place
- **Profile Management** — Update display name, upload avatar, change password
- **Share Links** — Generate a unique link so friends can view and contribute to your media collection
- **Category Preferences** — Select content categories on first launch; preferences are saved
- **Android App** — Packaged as a native Android APK via Capacitor

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Python 3.10+, FastAPI, SQLAlchemy, SQLite |
| Auth | JWT (python-jose), bcrypt (passlib) |
| Frontend | React 18, TypeScript, Vite |
| Styling | Tailwind CSS, Framer Motion |
| HTTP Client | Axios |
| Routing | React Router v6 |
| Mobile | Capacitor 6 (Android) |
| Content | YouTube RSS feeds |

---

## Project Structure

```
wish2/
├── backend/
│   ├── app/
│   │   ├── main.py           # FastAPI app entry point, startup logic
│   │   ├── database.py       # SQLAlchemy engine and session setup
│   │   ├── models.py         # Database models: User, Post, Interaction, CategoryLike
│   │   ├── auth.py           # JWT creation, password hashing, current_user dependency
│   │   ├── seed.py           # Demo data seeder (used when no YouTube playlists configured)
│   │   ├── youtube_sync.py   # Fetches YouTube playlist RSS feeds into the database
│   │   └── routers/
│   │       ├── auth.py       # POST /register, POST /login, GET /me
│   │       ├── content.py    # GET /feed, GET /new, GET /favorites, POST /{id}/interact
│   │       ├── profile.py    # Profile, avatar, media upload, share links, stats
│   │       └── share.py      # Public share page and upload via share token
│   ├── uploads/              # Uploaded files directory (auto-created)
│   ├── wishscroll.db         # SQLite database (auto-created on first run)
│   └── requirements.txt      # Python dependencies
│
├── frontend/
│   ├── src/
│   │   ├── App.tsx           # Root component, routing, auth guards
│   │   ├── main.tsx          # React entry point
│   │   ├── index.css         # Global styles and CSS variables
│   │   ├── components/
│   │   │   ├── ContentSwiper.tsx    # Main swipeable feed with category selection
│   │   │   ├── GestureController.tsx # Face/gesture detection component
│   │   │   └── PhoneShell.tsx       # Phone frame UI wrapper
│   │   ├── pages/
│   │   │   ├── Login.tsx        # Login page
│   │   │   ├── Register.tsx     # Registration page
│   │   │   ├── Home.tsx         # Home — renders ContentSwiper
│   │   │   ├── Profile.tsx      # Profile management
│   │   │   ├── MyMedia.tsx      # Personal media + liked categories + share
│   │   │   ├── Favourites.tsx   # Saved posts feed
│   │   │   └── ShareUpload.tsx  # Public share upload page
│   │   ├── contexts/
│   │   │   └── AuthContext.tsx  # Auth state provider (user, login, logout)
│   │   ├── services/
│   │   │   ├── apiClient.ts     # Axios instance with JWT interceptor
│   │   │   ├── authService.ts   # Auth API calls
│   │   │   └── contentService.ts # Content API calls
│   │   └── types/
│   │       └── api.ts           # TypeScript interfaces for API responses
│   ├── .env                  # Frontend environment variables (see below)
│   ├── capacitor.config.ts   # Capacitor/Android configuration
│   ├── vite.config.ts        # Vite build configuration
│   └── package.json          # Node dependencies
│
└── README.md
```

---

## Prerequisites

Make sure you have the following installed before starting:

| Tool | Version | Download |
|---|---|---|
| Python | 3.10 or higher | https://www.python.org/downloads |
| Node.js | 18 or higher (LTS) | https://nodejs.org |
| Git | Any recent version | https://git-scm.com/downloads |

**To verify your installations, run:**

```bash
python --version
node --version
npm --version
git --version
```

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/wishscroll.git
cd wishscroll
```

---

### 2. Backend Setup

#### Step 1 — Create and activate a virtual environment

**Windows (PowerShell):**
```powershell
cd wish2/backend
python -m venv venv
venv\Scripts\activate
```

**Mac / Linux:**
```bash
cd wish2/backend
python -m venv venv
source venv/bin/activate
```

You should see `(venv)` appear at the start of your terminal prompt.

#### Step 2 — Install dependencies

```bash
pip install -r requirements.txt
```

If a `requirements.txt` is not yet present, install manually:

```bash
pip install fastapi uvicorn sqlalchemy "python-jose[cryptography]" "passlib[bcrypt]" python-multipart "bcrypt==4.0.1"
```

> **Important:** Always install `bcrypt==4.0.1` specifically. Newer versions of bcrypt (5.x) are incompatible with the version of passlib used in this project and will cause a `ValueError` on registration/login.

#### Step 3 — Configure environment variables

Create a file called `.env` inside `wish2/backend/`:

```
SECRET_KEY=your-secret-key-change-this-in-production
DATABASE_URL=sqlite:///./wishscroll.db
```

> **Never commit this file to GitHub.** It is listed in `.gitignore`.

#### Step 4 — Start the backend server

```bash
python -m uvicorn app.main:app --reload --port 8000
```

You should see:
```
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Application startup complete.
```

The API documentation is available at: **http://localhost:8000/docs**

---

### 3. Frontend Setup

Open a **new terminal window** (keep the backend running in the first one).

#### Step 1 — Install dependencies

```bash
cd wish2/frontend
npm install --legacy-peer-deps
```

> The `--legacy-peer-deps` flag is needed due to a version conflict between `eslint` v9 and `eslint-plugin-react-hooks` v4. This only affects development tooling and does not impact the running app.

#### Step 2 — Configure environment variables

Check that the file `wish2/frontend/.env` exists and contains:

```
VITE_API_URL=http://localhost:8000/api/v1
```

If the file doesn't exist, create it with the line above.

#### Step 3 — Start the frontend

```bash
npm run dev
```

You should see:
```
VITE v5.x.x  ready in xxxms
➜  Local:   http://localhost:5173/
```

---

### 4. Running the App

Once both servers are running:

1. Open your browser and go to **http://localhost:5173**
2. Click **Register** to create a new account
3. Select your content categories on the welcome screen
4. Start scrolling!

**Default ports:**

| Service | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:8000 |
| API Docs (Swagger) | http://localhost:8000/docs |

---

## Environment Variables

### Backend (`wish2/backend/.env`)

| Variable | Description | Example |
|---|---|---|
| `SECRET_KEY` | Secret key used to sign JWT tokens. Change this in production. | `my-super-secret-key-123` |
| `DATABASE_URL` | SQLAlchemy database connection string | `sqlite:///./wishscroll.db` |

### Frontend (`wish2/frontend/.env`)

| Variable | Description | Example |
|---|---|---|
| `VITE_API_URL` | Base URL of the backend API | `http://localhost:8000/api/v1` |

---

## API Reference

All endpoints (except `/api/v1/auth/register` and `/api/v1/auth/login`) require a Bearer token in the `Authorization` header.

### Auth

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/v1/auth/register` | Create a new account |
| POST | `/api/v1/auth/login` | Log in and receive a JWT token |
| GET | `/api/v1/auth/me` | Get the currently logged-in user |

### Content

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/v1/content/feed` | Get paginated content feed |
| GET | `/api/v1/content/new` | Get newest posts |
| GET | `/api/v1/content/favorites` | Get saved posts for current user |
| POST | `/api/v1/content/{post_id}/interact` | Record a like, dislike, or save |

### Profile

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/v1/profile/` | Get current user profile |
| PUT | `/api/v1/profile/` | Update display name |
| POST | `/api/v1/profile/avatar` | Upload profile picture |
| POST | `/api/v1/profile/media` | Upload personal photo or video |
| GET | `/api/v1/profile/media` | Get all personal media |
| DELETE | `/api/v1/profile/media/{post_id}` | Delete a personal media item |
| GET | `/api/v1/profile/stats` | Get likes, saves, dislikes count |
| POST | `/api/v1/profile/change-password` | Change account password |
| POST | `/api/v1/profile/share-link` | Generate a shareable link token |
| GET | `/api/v1/profile/share-link` | Get existing share link |

### Share (Public — no auth required)

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/v1/share/{token}` | View a user's shared media collection |
| POST | `/api/v1/share/{token}/upload` | Upload media to a shared collection |

### Admin

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/v1/admin/sync` | Manually trigger YouTube playlist sync |

---

## Database Models

### User
| Field | Type | Description |
|---|---|---|
| `id` | Integer | Primary key |
| `email` | String | Unique, required |
| `name` | String | Display name |
| `hashed_password` | String | bcrypt hash |
| `avatar_url` | String | Base64 data URL |
| `share_token` | String | Unique share link token |
| `created_at` | DateTime | Account creation time |

### Post
| Field | Type | Description |
|---|---|---|
| `id` | Integer | Primary key |
| `title` | String | Post title |
| `content_url` | String | URL or base64 data URL |
| `content_type` | String | `image` or `video` |
| `source` | String | `youtube`, `personal`, `shared`, or `curated` |
| `tags` | String | Comma-separated tags |
| `created_at` | DateTime | Creation time |

### Interaction
| Field | Type | Description |
|---|---|---|
| `id` | Integer | Primary key |
| `user_id` | Integer | FK to User |
| `post_id` | Integer | FK to Post |
| `interaction_type` | String | `like`, `dislike`, or `save` |
| `dwell_time_seconds` | Integer | How long the user viewed the post |
| `created_at` | DateTime | Interaction time |

### CategoryLike
| Field | Type | Description |
|---|---|---|
| `id` | Integer | Primary key |
| `user_id` | Integer | FK to User |
| `category` | String | Category name |
| `created_at` | DateTime | Time of like |

---

## YouTube Content Setup

WishScroll can pull content directly from YouTube playlists. To configure this:

1. Open `wish2/backend/app/youtube_sync.py`
2. Find the `PLAYLIST_IDS` list near the top of the file
3. Replace the existing ID with your own playlist IDs:

```python
PLAYLIST_IDS = [
    "PLxxxxxxxxxxxxxxxx",   # Playlist 1
    "PLyyyyyyyyyyyyyyyy",   # Playlist 2
]
```

**How to find a playlist ID:**
1. Go to YouTube and open any playlist
2. Look at the URL: `https://youtube.com/playlist?list=PLxxxxxxxx`
3. The part after `list=` is the playlist ID

The frontend has 8 built-in category playlists mapped in `ContentSwiper.tsx`:

```
Animals, Sports, Adrenaline, Art, Learn, Funny, Kindness, Interesting
```

To sync playlists manually without restarting the server:

```bash
curl -X POST http://localhost:8000/api/v1/admin/sync
```

If no playlist IDs are configured, the app starts with an empty database (the seed file currently contains no demo posts).

---

## Android Build

The app is packaged for Android using Capacitor. A pre-built debug APK is located at:

```
wish2/frontend/android/app/build/intermediates/apk/debug/app-debug.apk
```

### Installing the APK on an Android device

1. Transfer the `.apk` file to your Android phone (via USB or Google Drive)
2. On your phone, go to **Settings > Security > Install unknown apps** and allow your file manager
3. Open the APK file and tap **Install**

### Building a fresh APK

Make sure your backend is deployed to a public URL first (the emulator cannot reach `localhost`), then:

```bash
cd wish2/frontend

# Update the server URL in capacitor.config.ts to your public backend URL
# Then build and sync:
npm run build
npm run cap:sync
npm run cap:open:android
```

This opens Android Studio where you can build and run the APK.

---

## Known Issues & Fixes

### `bcrypt` ValueError on register/login
**Error:** `ValueError: password cannot be longer than 72 bytes`

**Cause:** `bcrypt` v5.x is incompatible with `passlib` v1.7.4.

**Fix:**
```bash
pip install "bcrypt==4.0.1" --force-reinstall
```

---

### `npm` not recognised on Windows
**Error:** `npm : The term 'npm' is not recognized`

**Fix:** Install Node.js from https://nodejs.org, then close and reopen PowerShell. If it still doesn't work, run:
```powershell
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
```

---

### PowerShell execution policy error
**Error:** `File cannot be loaded because running scripts is disabled on this system`

**Fix:**
```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

---

### `npm install` peer dependency conflict
**Error:** `ERESOLVE could not resolve` (eslint-plugin-react-hooks)

**Fix:**
```bash
npm install --legacy-peer-deps
```

---

### uvicorn command not found (wrong path after copying venv)
**Error:** `Fatal error in launcher: Unable to create process`

**Cause:** The `venv` folder was created on a different machine and contains hardcoded paths.

**Fix:** Delete the venv and recreate it:
```powershell
deactivate
Remove-Item -Recurse -Force venv
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

---

### Registration fails with CORS error (Status 500)
**Error:** `Cross-Origin Request Blocked: CORS header 'Access-Control-Allow-Origin' missing`

**Cause:** The backend is crashing (500 error) before it can attach CORS headers. Most likely the bcrypt version issue above.

**Fix:** See the bcrypt fix above, then restart the backend.

---

## Contributing (Git Workflow)

### First-time setup

```bash
git clone https://github.com/YOUR_USERNAME/wishscroll.git
cd wishscroll
```

### Daily workflow

```bash
# 1. Always start by pulling the latest main
git checkout main
git pull origin main

# 2. Create your own branch
git checkout -b devN/your-task-name

# 3. Make your changes, then commit
git add .
git commit -m "Fix: description of what you changed"

# 4. Push your branch to GitHub
git push origin devN/your-task-name

# 5. Open a Pull Request on GitHub and request a review
```

### Branch naming

| Developer | Format | Example |
|---|---|---|
| Dev 1 — Backend | `dev1/task-name` | `dev1/youtube-sync-fix` |
| Dev 2 — Security | `dev2/task-name` | `dev2/secret-key-env` |
| Dev 3 — Frontend | `dev3/task-name` | `dev3/share-route-fix` |
| Dev 4 — DevOps | `dev4/task-name` | `dev4/add-tests` |

### Rules

- Never push directly to `main` — always use a branch and pull request
- Always pull latest `main` before starting new work
- Never commit `.env`, `venv/`, `node_modules/`, or `wishscroll.db`
- Write clear commit messages — `"Fix: bcrypt version conflict"` not `"fix stuff"`
- Get at least one teammate to review your pull request before merging

### .gitignore

Make sure your `.gitignore` at the project root includes:

```
backend/venv/
backend/.env
backend/wishscroll.db
frontend/node_modules/
frontend/dist/
frontend/android/.gradle/
__pycache__/
*.pyc
*.db
```

---

## Team

| Developer | Area |
|---|---|
| Dev 1 | Backend & Database |
| Dev 2 | Authentication & Security |
| Dev 3 | Frontend & UI |
| Dev 4 | DevOps & Testing |

---

*WishScroll — Happy scrolling! 🌀*
