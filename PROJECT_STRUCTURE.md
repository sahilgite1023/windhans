# 📂 Complete Project Structure

```
windhands/
│
├── 📁 app/                              # Next.js App Router
│   │
│   ├── 📁 api/                          # Backend API Routes
│   │   ├── 📁 auth/                     # Authentication endpoints
│   │   │   ├── 📁 login/
│   │   │   │   └── route.js             # POST /api/auth/login
│   │   │   ├── 📁 register/
│   │   │   │   └── route.js             # POST /api/auth/register
│   │   │   ├── 📁 logout/
│   │   │   │   └── route.js             # POST /api/auth/logout
│   │   │   └── 📁 me/
│   │   │       └── route.js             # GET /api/auth/me
│   │   │
│   │   └── 📁 reels/                    # Reels endpoints
│   │       ├── route.js                 # GET /api/reels (all reels)
│   │       └── 📁 upload/
│   │           └── route.js             # POST /api/reels/upload
│   │
│   ├── 📁 feed/                         # Feed page (protected)
│   │   └── page.js                      # /feed route
│   │
│   ├── 📁 login/                        # Login page (public)
│   │   └── page.js                      # /login route
│   │
│   ├── 📁 profile/                      # Profile page (protected)
│   │   └── page.js                      # /profile route
│   │
│   ├── 📁 register/                     # Registration page (public)
│   │   └── page.js                      # /register route
│   │
│   ├── 📁 upload/                       # Upload page (protected)
│   │   └── page.js                      # /upload route
│   │
│   ├── layout.js                        # Root layout (wraps all pages)
│   ├── page.js                          # Home/landing page (/)
│   └── globals.css                      # Global CSS styles
│
├── 📁 components/                       # Reusable React components
│   ├── LogoutButton.js                  # Logout button (client component)
│   ├── ReelCard.js                      # Reel card for grid view
│   ├── ReelFeedItem.js                  # Reel item for feed view
│   └── UploadForm.js                    # Video upload form
│
├── 📁 lib/                              # Utility libraries
│   ├── auth.js                          # Authentication helpers
│   ├── cloudinary.js                    # Cloudinary configuration
│   └── prisma.js                        # Prisma client instance
│
├── 📁 prisma/                           # Database configuration
│   └── schema.prisma                    # Database schema (User, Reel)
│
├── 📁 node_modules/                     # Dependencies (auto-generated)
│
├── .env                                 # Environment variables (secrets)
├── .env.example                         # Template for .env
├── .gitignore                           # Files to ignore in Git
├── ARCHITECTURE.md                      # System architecture docs
├── BEGINNER_GUIDE.md                    # Beginner-friendly explanation
├── jsconfig.json                        # JavaScript config (path aliases)
├── middleware.js                        # Route protection middleware
├── next.config.js                       # Next.js configuration
├── package.json                         # Project dependencies & scripts
├── postcss.config.js                    # PostCSS configuration
├── README.md                            # Main documentation
├── SETUP.md                             # Quick setup guide
└── tailwind.config.js                   # Tailwind CSS configuration
```

---

## 📋 File Count Summary

- **Total Files**: 31
- **Page Components**: 6 (landing, login, register, feed, profile, upload)
- **API Routes**: 6 (register, login, logout, me, reels, upload)
- **Reusable Components**: 4 (LogoutButton, ReelCard, ReelFeedItem, UploadForm)
- **Utility Libraries**: 3 (auth, cloudinary, prisma)
- **Documentation**: 5 (README, SETUP, ARCHITECTURE, BEGINNER_GUIDE, this file)
- **Configuration**: 7 (next, tailwind, postcss, jsconfig, etc.)

---

## 🎯 File Purposes Quick Reference

### Pages (User-Facing Routes)
| File | Route | Protected | Purpose |
|------|-------|-----------|---------|
| `app/page.js` | `/` | ❌ | Landing page with features |
| `app/login/page.js` | `/login` | ❌ | User login form |
| `app/register/page.js` | `/register` | ❌ | User registration form |
| `app/feed/page.js` | `/feed` | ✅ | Main reels feed |
| `app/profile/page.js` | `/profile` | ✅ | User profile & reels |
| `app/upload/page.js` | `/upload` | ✅ | Upload new reel |

### API Routes (Backend Endpoints)
| File | Endpoint | Method | Purpose |
|------|----------|--------|---------|
| `app/api/auth/register/route.js` | `/api/auth/register` | POST | Create account |
| `app/api/auth/login/route.js` | `/api/auth/login` | POST | Authenticate user |
| `app/api/auth/logout/route.js` | `/api/auth/logout` | POST | End session |
| `app/api/auth/me/route.js` | `/api/auth/me` | GET | Get current user |
| `app/api/reels/route.js` | `/api/reels` | GET | Fetch all reels |
| `app/api/reels/upload/route.js` | `/api/reels/upload` | POST | Upload video |

### Components (Reusable UI)
| File | Type | Purpose |
|------|------|---------|
| `components/LogoutButton.js` | Client | Logout functionality |
| `components/ReelCard.js` | Client | Grid view reel card |
| `components/ReelFeedItem.js` | Client | Feed view reel with auto-play |
| `components/UploadForm.js` | Client | Video upload form with preview |

### Libraries (Helper Functions)
| File | Purpose |
|------|---------|
| `lib/auth.js` | Get current user, check authentication |
| `lib/cloudinary.js` | Cloudinary SDK configuration |
| `lib/prisma.js` | Prisma client singleton |

### Configuration Files
| File | Purpose |
|------|---------|
| `next.config.js` | Next.js settings (allowed image domains) |
| `tailwind.config.js` | Custom colors, theme extension |
| `postcss.config.js` | CSS processing (Tailwind) |
| `jsconfig.json` | Path aliases (`@/` = root) |
| `middleware.js` | Route protection logic |
| `package.json` | Dependencies and scripts |
| `.env` | Secret environment variables |
| `.gitignore` | Files excluded from Git |

### Database
| File | Purpose |
|------|---------|
| `prisma/schema.prisma` | User and Reel models, relationships |

### Documentation
| File | Audience | Content |
|------|----------|---------|
| `README.md` | All users | Main documentation, features, setup |
| `SETUP.md` | Beginners | Quick setup steps, troubleshooting |
| `ARCHITECTURE.md` | Developers | System design, data flow, diagrams |
| `BEGINNER_GUIDE.md` | Beginners | Concepts explained simply |
| `PROJECT_STRUCTURE.md` | All users | This file - project overview |

---

## 🔄 Data Flow Through Files

### User Registration Flow:
```
1. app/register/page.js (form)
   ↓
2. app/api/auth/register/route.js (API)
   ↓
3. lib/prisma.js (database client)
   ↓
4. PostgreSQL database (Neon)
```

### User Login Flow:
```
1. app/login/page.js (form)
   ↓
2. app/api/auth/login/route.js (API)
   ↓
3. lib/prisma.js (find user)
   ↓
4. bcrypt.compare() (verify password)
   ↓
5. Set cookie (session)
```

### Protected Page Access:
```
1. middleware.js (check cookie)
   ↓
2. app/feed/page.js (server component)
   ↓
3. lib/auth.js (getCurrentUser)
   ↓
4. lib/prisma.js (fetch user + reels)
   ↓
5. components/ReelFeedItem.js (render)
```

### Video Upload Flow:
```
1. components/UploadForm.js (select file)
   ↓
2. app/api/reels/upload/route.js (API)
   ↓
3. lib/cloudinary.js (upload video)
   ↓
4. Cloudinary CDN (store video)
   ↓
5. lib/prisma.js (save URL to DB)
```

---

## 📦 Dependencies Breakdown

### Production Dependencies (needed to run):
```json
{
  "next": "Next.js framework",
  "react": "UI library",
  "react-dom": "React DOM renderer",
  "@prisma/client": "Database ORM client",
  "bcrypt": "Password hashing",
  "cloudinary": "Video upload SDK",
  "cookie": "Cookie parsing"
}
```

### Development Dependencies (needed to build):
```json
{
  "prisma": "Database schema management",
  "autoprefixer": "CSS vendor prefixes",
  "postcss": "CSS processing",
  "tailwindcss": "Utility CSS framework"
}
```

---

## 🎨 Styling Organization

```
Styling System:
│
├── tailwind.config.js
│   └── Custom theme (colors, extend)
│
├── app/globals.css
│   ├── Tailwind directives (@tailwind)
│   ├── Custom scrollbar
│   └── Global utilities
│
└── Component classes
    └── Inline className="..." (Tailwind utilities)
```

---

## 🔐 Security Files

| File | Security Feature |
|------|------------------|
| `.env` | Secret storage (not in Git) |
| `.gitignore` | Prevents leaking secrets |
| `lib/auth.js` | Session validation |
| `middleware.js` | Route protection |
| `app/api/auth/*/route.js` | bcrypt password hashing |

---

## 📊 Lines of Code (Approximate)

- **Total**: ~2,500 lines
- **Pages**: ~800 lines
- **API Routes**: ~500 lines
- **Components**: ~600 lines
- **Libraries**: ~150 lines
- **Config**: ~200 lines
- **Documentation**: ~1,500 lines

---

## 🚀 Build Output

When you run `npm run build`, Next.js creates:

```
.next/
├── cache/              # Build cache
├── server/             # Server-side code
│   ├── app/            # Compiled pages
│   └── chunks/         # Code chunks
└── static/             # Static assets
    ├── chunks/         # JavaScript bundles
    └── css/            # Compiled CSS
```

---

## 📱 Mobile Responsiveness

Responsive breakpoints (Tailwind):
```
sm: 640px   → Small tablets
md: 768px   → Tablets
lg: 1024px  → Laptops
xl: 1280px  → Desktops
2xl: 1536px → Large screens
```

Used in components for responsive layouts:
```jsx
<div className="
  grid
  grid-cols-1      /* 1 column on mobile */
  md:grid-cols-2   /* 2 columns on tablets */
  lg:grid-cols-3   /* 3 columns on desktop */
">
```

---

## 🎯 Essential Commands

```bash
# Development
npm run dev         # Start dev server (http://localhost:3000)
npm run build       # Build for production
npm run start       # Run production build

# Database
npx prisma generate # Generate Prisma client
npx prisma db push  # Push schema to database
npx prisma studio   # Open database GUI

# Utilities
npm install         # Install dependencies
npm run lint        # Check code quality
```

---

## 📈 Future Scalability

Files ready to be extended:
- `prisma/schema.prisma` → Add Like, Comment, Follow models
- `components/` → Add more reusable components
- `app/api/` → Add more API endpoints
- `lib/` → Add more utility functions
- `middleware.js` → Add more security checks

---

This structure is:
✅ Organized by feature
✅ Easy to navigate
✅ Scalable for growth
✅ Beginner-friendly
✅ Production-ready

