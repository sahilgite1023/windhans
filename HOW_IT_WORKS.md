# How WindHans Works - Simple Explanation

## 🛠️ Tech Stack (Technologies Used)

### Frontend (What Users See)
- **Next.js 14** - Main framework for building the website
- **React 18** - Library for creating interactive user interfaces
- **Tailwind CSS** - For making the app look beautiful with easy styling

### Backend (Server Side)
- **Next.js API Routes** - Built-in server to handle requests
- **Prisma** - Tool to talk to the database easily
- **PostgreSQL (Neon)** - Database to store all user data and reels

### Storage & Authentication
- **Cloudinary** - Stores and delivers video files (reels)
- **JWT (jsonwebtoken)** - Creates secure login tokens
- **bcrypt** - Encrypts passwords for security
- **Cookies** - Stores login session in browser

---

## 🔐 How Login & Signup Works

### Signup Process
1. User fills registration form with email, username, and password
2. App checks if email already exists in database
3. Password gets encrypted using **bcrypt** library (makes it unreadable)
4. User data saved to database using **Prisma**
5. User redirected to login page

**Library Used**: `bcrypt` for password encryption, `Prisma` for database

### Login Process
1. User enters email and password
2. App finds user in database by email
3. **bcrypt** compares entered password with encrypted password in database
4. If match, **JWT** creates a secure token (like a digital ID card)
5. Token saved in browser **cookie** (userId)
6. User redirected to feed page

**Libraries Used**: `bcrypt` for password checking, `jsonwebtoken` for creating tokens, `cookie` library for storing session

### How App Knows You're Logged In
- **Middleware.js** checks every page request
- Reads `userId` cookie from browser
- If cookie exists → user is logged in → allow access to protected pages
- If no cookie → user not logged in → redirect to login page

---

## 🎥 How Reel Upload Works

### Upload Process
1. User selects video file from their device
2. Video file sent to **Cloudinary** using their upload API
3. Cloudinary processes the video and returns a **public URL**
4. App saves this information to database:
   - Video URL from Cloudinary
   - Title and description from user
   - User ID (who uploaded it)
   - Current timestamp
5. Database stores it using **Prisma**

**Library Used**: `cloudinary` package to upload videos

**API Route**: `/api/reels/upload`

---

## ▶️ How Reel Playing Works

### Video Display
1. Feed page loads all reels from database
2. Each reel has Cloudinary video URL
3. Next.js `<video>` HTML tag plays the video
4. Cloudinary automatically delivers optimized video

**Features**:
- Videos play in browser using native HTML5 video player
- Cloudinary handles video quality and streaming
- Auto-play when video comes in view

**No special library needed** - uses standard HTML `<video>` element

---

## ❤️ How Likes Work

### Like Process
1. User clicks heart icon on a reel
2. App sends request to `/api/reels/[id]/like`
3. Server checks if user already liked this reel
4. **If not liked**: Creates new like record in database
5. **If already liked**: Removes the like record
6. Returns updated like count
7. UI updates to show filled/unfilled heart

**Database**: Prisma stores likes with `userId` and `reelId`

---

## 💬 How Comments Work

### Comment Process
1. User types comment and clicks submit
2. App sends comment text to `/api/reels/[id]/comments`
3. Server saves comment in database with:
   - Comment text
   - User ID (who commented)
   - Reel ID (which video)
   - Timestamp
4. Database returns saved comment with user details
5. Comment appears immediately on screen

**Database**: Prisma stores comments and fetches them with user information

---

## 👤 How Profile Works

### Profile Page
1. User visits `/profile` page
2. **Middleware** checks if user is logged in (reads cookie)
3. App calls `/api/auth/me` to get current user details
4. Server reads `userId` from cookie
5. Finds user in database using Prisma
6. Returns user info (name, email, username)
7. Fetches all reels uploaded by this user
8. Displays user info and their reels

### Logout
1. User clicks logout button
2. App calls `/api/auth/logout`
3. Server deletes the `userId` cookie
4. User redirected to login page
5. Can no longer access protected pages

---

## 🔒 Protected Routes (Pages That Need Login)

**Middleware.js** protects these pages:
- `/feed` - Main reel feed
- `/profile` - User profile
- `/upload` - Upload new reel

**How Protection Works**:
1. User tries to visit protected page
2. Middleware checks for `userId` cookie
3. If cookie exists → user logged in → allow access
4. If no cookie → redirect to `/login`

---

## 📊 Database Structure (Using Prisma)

### User Table
- Stores: id, email, username, password (encrypted), name

### Reel Table
- Stores: id, title, description, videoUrl, userId, timestamps

### Like Table
- Stores: id, userId, reelId (tracks who liked which reel)

### Comment Table
- Stores: id, text, userId, reelId, timestamp

**Prisma** makes it easy to:
- Create new records
- Find existing records
- Update and delete records
- Join tables (get user info with reels)

---

## 🌐 How Everything Connects

1. **User visits website** → Next.js serves the page
2. **User logs in** → JWT creates token → Saved in cookie
3. **Browse reels** → Data fetched from PostgreSQL using Prisma
4. **Watch videos** → Streamed from Cloudinary
5. **Like/Comment** → Updates PostgreSQL database
6. **Upload reel** → Video to Cloudinary → URL to PostgreSQL
7. **Logout** → Cookie deleted → Redirected to login

---

## 📁 Key Files

- **`middleware.js`** - Protects routes, checks login status
- **`lib/auth.js`** - Login/signup logic, JWT functions
- **`lib/cloudinary.js`** - Video upload to Cloudinary
- **`lib/prisma.js`** - Database connection
- **`app/api/*`** - All server endpoints (login, reels, likes, comments)
- **`app/feed/page.js`** - Main feed page
- **`components/ReelCard.js`** - Single reel display component

---

## 🚀 Summary

This app is a **social media platform for short videos (reels)** built with:
- **Next.js** for the website
- **PostgreSQL** for storing data
- **Cloudinary** for storing videos
- **JWT + Cookies** for keeping users logged in
- **Prisma** for easy database operations
- **bcrypt** for password security

Everything works together to let users signup, login, upload videos, watch reels, like and comment, and manage their profile - all in a simple, secure way.
