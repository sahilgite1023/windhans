# ARCHITECTURE GUIDE

## 🏗️ System Architecture Overview

This document explains how all the pieces of the application work together.

---

## 📊 Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER BROWSER                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │  Login   │  │   Feed   │  │ Profile  │  │  Upload  │       │
│  │  Page    │  │   Page   │  │   Page   │  │   Page   │       │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘       │
└───────┼─────────────┼─────────────┼─────────────┼──────────────┘
        │             │             │             │
        │      HTTPS Requests (JSON / FormData)   │
        │             │             │             │
┌───────▼─────────────▼─────────────▼─────────────▼──────────────┐
│                    NEXT.JS APP ROUTER                           │
│  ┌────────────────────────────────────────────────────────┐    │
│  │               MIDDLEWARE (Route Protection)            │    │
│  │  - Check authentication cookie                         │    │
│  │  - Redirect if unauthorized                            │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                 │
│  ┌─────────────────────┐    ┌─────────────────────┐           │
│  │   SERVER PAGES      │    │    API ROUTES       │           │
│  │                     │    │                     │           │
│  │  /feed              │    │  /api/auth/login    │           │
│  │  /profile           │    │  /api/auth/register │           │
│  │  /upload            │    │  /api/auth/logout   │           │
│  │                     │    │  /api/reels/upload  │           │
│  │  (Fetch from DB)    │    │  /api/reels         │           │
│  └──────────┬──────────┘    └──────────┬──────────┘           │
└─────────────┼──────────────────────────┼──────────────────────┘
              │                          │
              │                          │
        ┌─────▼──────┐            ┌─────▼──────┐
        │  Prisma    │            │   bcrypt   │
        │  ORM       │            │  (Hashing) │
        └─────┬──────┘            └────────────┘
              │
        ┌─────▼──────────────┐
        │   PostgreSQL       │
        │   (Neon Cloud)     │
        │                    │
        │  ┌──────────────┐  │
        │  │  User Table  │  │
        │  │  Reel Table  │  │
        │  └──────────────┘  │
        └────────────────────┘

              ┌─────────────────┐
              │   Cloudinary    │
              │   (Video CDN)   │
              │                 │
              │  Video Storage  │
              └─────────────────┘
```

---

## 🔄 Data Flow Examples

### **1. User Registration Flow**

```
User fills form → Submit
    ↓
POST /api/auth/register
    ↓
Validate input (name, email, password)
    ↓
Check if email exists in database
    ↓
Hash password with bcrypt
    ↓
Save user to PostgreSQL via Prisma
    ↓
Return success
    ↓
Redirect to /login
```

**Code Path**:
1. `app/register/page.js` - Form UI
2. `app/api/auth/register/route.js` - API handler
3. `lib/prisma.js` - Database client
4. Neon PostgreSQL - Data storage

---

### **2. User Login Flow**

```
User enters credentials → Submit
    ↓
POST /api/auth/login
    ↓
Find user by email in database
    ↓
Compare password hash using bcrypt
    ↓
If match: Create session cookie
    ↓
Set HttpOnly cookie with userId
    ↓
Redirect to /feed
```

**Code Path**:
1. `app/login/page.js` - Form UI
2. `app/api/auth/login/route.js` - API handler
3. bcrypt.compare() - Password verification
4. response.cookies.set() - Session creation

---

### **3. Protected Page Access Flow**

```
User visits /feed
    ↓
Middleware checks for userId cookie
    ↓
If no cookie: Redirect to /login
    ↓
If cookie exists: Continue
    ↓
Server Component reads cookie
    ↓
Call getCurrentUser() helper
    ↓
Fetch user from database
    ↓
Fetch reels from database
    ↓
Render page with data
```

**Code Path**:
1. `middleware.js` - Route protection
2. `app/feed/page.js` - Server Component
3. `lib/auth.js` - getCurrentUser()
4. Prisma queries database

---

### **4. Video Upload Flow**

```
User selects video file → Add caption → Submit
    ↓
Client validates file (size, type)
    ↓
Create FormData with video + caption
    ↓
POST /api/reels/upload
    ↓
Server checks authentication
    ↓
Convert file to buffer
    ↓
Upload to Cloudinary (stream)
    ↓
Get back video URL
    ↓
Save reel to database (URL, caption, userId)
    ↓
Return success
    ↓
Redirect to /feed
```

**Code Path**:
1. `app/upload/page.js` - Upload UI
2. `components/UploadForm.js` - Form logic
3. `app/api/reels/upload/route.js` - Upload handler
4. `lib/cloudinary.js` - Cloudinary client
5. `lib/prisma.js` - Save to database

---

### **5. Feed Display Flow**

```
User opens /feed
    ↓
Server fetches all reels from database
    ↓
Include user info (via Prisma relation)
    ↓
Sort by createdAt DESC (newest first)
    ↓
Pass reels to ReelFeedItem components
    ↓
Each video element uses Intersection Observer
    ↓
Auto-play when scrolled into view
    ↓
Videos stream from Cloudinary CDN
```

**Code Path**:
1. `app/feed/page.js` - Server Component
2. Prisma query with `include: { user: ... }`
3. `components/ReelFeedItem.js` - Video player
4. Intersection Observer API - Auto-play logic

---

## 🗃️ Database Relationships

```
┌─────────────────┐
│      User       │
│─────────────────│
│ id (PK)         │──┐
│ name            │  │
│ email (unique)  │  │
│ password (hash) │  │
│ createdAt       │  │
└─────────────────┘  │
                     │ One-to-Many
                     │
                     ▼
              ┌─────────────────┐
              │      Reel       │
              │─────────────────│
              │ id (PK)         │
              │ videoUrl        │
              │ caption         │
              │ userId (FK)     │──references User.id
              │ createdAt       │
              └─────────────────┘

Relationship: One user can have many reels
When user is deleted → cascade delete all their reels
```

---

## 🔐 Authentication Architecture

```
┌──────────────────────────────────────────┐
│           User Registration              │
└──────────────────┬───────────────────────┘
                   │
                   ▼
       ┌───────────────────────┐
       │  Plain Password       │
       │  "mypassword123"      │
       └───────────┬───────────┘
                   │
                   ▼
       ┌───────────────────────┐
       │  bcrypt.hash(pwd, 10) │
       │  10 rounds of salting │
       └───────────┬───────────┘
                   │
                   ▼
       ┌────────────────────────────────────┐
       │  Hashed Password (stored in DB)    │
       │  "$2b$10$abcd...xyz123"            │
       └────────────────────────────────────┘

┌──────────────────────────────────────────┐
│             User Login                   │
└──────────────────┬───────────────────────┘
                   │
                   ▼
       ┌───────────────────────┐
       │  User enters password │
       │  "mypassword123"      │
       └───────────┬───────────┘
                   │
                   ▼
       ┌─────────────────────────────────┐
       │  bcrypt.compare(entered, hash)  │
       │  Returns: true or false         │
       └──────────────┬──────────────────┘
                      │
            ┌─────────┴─────────┐
            ▼                   ▼
       ┌─────────┐         ┌─────────┐
       │  Match  │         │ No Match│
       │  ✓      │         │    ✗    │
       └────┬────┘         └────┬────┘
            │                   │
            ▼                   ▼
    Create Session      Return Error
    Set Cookie
```

---

## 🍪 Cookie-Based Sessions

```
┌─────────────────────────────────────────┐
│            Login Successful             │
└──────────────────┬──────────────────────┘
                   │
                   ▼
       ┌───────────────────────┐
       │  Set Cookie           │
       │  Name: userId         │
       │  Value: user.id       │
       │  HttpOnly: true       │
       │  Secure: true (prod)  │
       │  MaxAge: 7 days       │
       └───────────┬───────────┘
                   │
                   ▼
┌──────────────────────────────────────────┐
│     Browser stores cookie                │
│     Sent with every request              │
└──────────────────┬───────────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────┐
│     Server reads cookie                  │
│     cookies().get('userId')              │
│     Fetches user from database           │
└──────────────────────────────────────────┘

Security Features:
- HttpOnly: Can't be accessed by JavaScript (prevents XSS)
- Secure: Only sent over HTTPS (in production)
- SameSite: Prevents CSRF attacks
```

---

## 📦 Component Architecture

```
┌─────────────────────────────────────────┐
│           app/layout.js                 │
│           (Root Layout)                 │
│  - Applies to ALL pages                 │
│  - Loads globals.css                    │
│  - Sets metadata                        │
└──────────────────┬──────────────────────┘
                   │
        ┌──────────┼──────────┐
        │          │          │
        ▼          ▼          ▼
    ┌───────┐  ┌───────┐  ┌───────┐
    │ /feed │  │/profile│ │/upload│
    │ page  │  │  page  │ │ page  │
    └───┬───┘  └───┬───┘  └───┬───┘
        │          │          │
        └──────────┼──────────┘
                   │
           ┌───────┴────────┐
           │                │
           ▼                ▼
    ┌─────────────┐  ┌─────────────┐
    │ReelFeedItem │  │ UploadForm  │
    │ Component   │  │  Component  │
    └─────────────┘  └─────────────┘
```

**Component Types**:

1. **Server Components** (default):
   - Can fetch data directly
   - No client-side JavaScript
   - Examples: Page layouts, static content

2. **Client Components** (`'use client'`):
   - Interactive elements
   - React hooks (useState, useEffect)
   - Examples: Forms, buttons, video players

---

## 🌐 API Route Structure

```
app/api/
├── auth/
│   ├── register/route.js     → POST: Create user
│   ├── login/route.js        → POST: Authenticate user
│   ├── logout/route.js       → POST: Clear session
│   └── me/route.js           → GET: Current user info
└── reels/
    ├── route.js              → GET: All reels
    └── upload/route.js       → POST: Upload video

Each route.js exports:
- GET, POST, PUT, DELETE functions
- Returns NextResponse.json()
- Has access to cookies, headers, request body
```

---

## 🎨 Styling System

```
┌────────────────────────────────────┐
│      tailwind.config.js            │
│  - Define custom colors            │
│  - Extend theme                    │
│  - Configure content paths         │
└────────────┬───────────────────────┘
             │
             ▼
┌────────────────────────────────────┐
│      app/globals.css               │
│  - Import Tailwind directives      │
│  - Custom global styles            │
│  - Scrollbar styling               │
└────────────┬───────────────────────┘
             │
             ▼
┌────────────────────────────────────┐
│      Component Classes             │
│  className="..."                   │
│  - Utility-first CSS               │
│  - Responsive modifiers            │
│  - Hover/focus states              │
└────────────────────────────────────┘
```

**Example Class Usage**:
```jsx
<button className="
  bg-gradient-to-r from-primary to-secondary  // Gradient
  text-white                                   // Text color
  px-6 py-3                                    // Padding
  rounded-lg                                   // Border radius
  hover:shadow-lg                              // Hover effect
  transition                                   // Smooth animation
  transform hover:scale-105                    // Hover scale
">
  Click Me
</button>
```

---

## 🚀 Request Lifecycle

```
1. User clicks button
   ↓
2. Browser sends HTTP request
   ↓
3. Next.js receives request
   ↓
4. Middleware runs (check auth)
   ↓
5. Route handler executes
   ↓
6. Database query (if needed)
   ↓
7. External API call (if needed)
   ↓
8. Response prepared
   ↓
9. Next.js sends response
   ↓
10. Browser receives data
    ↓
11. React updates UI
```

---

## 🔧 Configuration Files

| File | Purpose |
|------|---------|
| `package.json` | Dependencies and scripts |
| `next.config.js` | Next.js settings (image domains) |
| `tailwind.config.js` | Tailwind theme customization |
| `postcss.config.js` | CSS processing |
| `jsconfig.json` | Path aliases (`@/`) |
| `middleware.js` | Route protection |
| `prisma/schema.prisma` | Database schema |
| `.env` | Environment variables |

---

## 📈 Performance Optimizations

1. **Image Optimization**: Next.js Image component (auto WebP)
2. **Video CDN**: Cloudinary serves videos globally
3. **Database Indexing**: Indexed userId and createdAt
4. **Server Components**: Zero JavaScript for static content
5. **Code Splitting**: Automatic per-route splitting
6. **Lazy Loading**: Videos load only when visible

---

## 🔒 Security Measures

1. **Password Hashing**: bcrypt with 10 rounds
2. **HttpOnly Cookies**: Prevents XSS attacks
3. **CSRF Protection**: SameSite cookie attribute
4. **SQL Injection**: Prisma ORM prevents this
5. **Input Validation**: Check all user inputs
6. **Environment Variables**: Secrets not in code
7. **HTTPS**: Enforced in production

---

## 📦 Deployment Architecture

```
┌─────────────────┐
│   GitHub Repo   │
│   (Source Code) │
└────────┬────────┘
         │
         │ Push
         ▼
┌─────────────────┐
│     Vercel      │
│  (Hosting)      │
│                 │
│  - Auto deploy  │
│  - Edge network │
│  - Serverless   │
└────────┬────────┘
         │
         │ Connects to
         │
    ┌────┴─────┐
    │          │
    ▼          ▼
┌────────┐  ┌──────────┐
│  Neon  │  │Cloudinary│
│  (DB)  │  │ (Videos) │
└────────┘  └──────────┘
```

---

This architecture is designed to be:
- ✅ **Scalable**: Can handle many users
- ✅ **Secure**: Protected against common attacks
- ✅ **Maintainable**: Clear separation of concerns
- ✅ **Fast**: Optimized for performance
- ✅ **Modern**: Uses latest best practices

