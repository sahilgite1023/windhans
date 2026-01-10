# Windhands - Short Video Sharing Platform

A modern, full-stack video sharing platform built with Next.js, featuring user authentication, video uploads, and a clean light-themed UI.

---

## 🚀 **FIRST TIME HERE?** → [START_HERE.md](START_HERE.md) or [QUICKSTART.md](QUICKSTART.md)

---

---

## 🚀 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: JavaScript (No TypeScript)
- **Database**: PostgreSQL (Neon Cloud)
- **ORM**: Prisma
- **Styling**: Tailwind CSS
- **Authentication**: bcrypt + cookies
- **Video Storage**: Cloudinary
- **Deployment**: Vercel (recommended)

---

## 📁 Project Structure

```
windhands/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── register/route.js    # User registration
│   │   │   ├── login/route.js       # User login
│   │   │   ├── logout/route.js      # User logout
│   │   │   └── me/route.js          # Get current user
│   │   └── reels/
│   │       ├── upload/route.js      # Upload video to Cloudinary
│   │       └── route.js             # Get all reels
│   ├── feed/page.js                 # Main reels feed (protected)
│   ├── login/page.js                # Login page
│   ├── profile/page.js              # User profile (protected)
│   ├── register/page.js             # Registration page
│   ├── upload/page.js               # Upload reel (protected)
│   ├── layout.js                    # Root layout
│   ├── page.js                      # Landing page
│   └── globals.css                  # Global styles
├── components/
│   ├── LogoutButton.js              # Logout functionality
│   ├── ReelCard.js                  # Reel card (grid view)
│   ├── ReelFeedItem.js              # Reel item (feed view)
│   └── UploadForm.js                # Video upload form
├── lib/
│   ├── auth.js                      # Authentication helpers
│   ├── cloudinary.js                # Cloudinary config
│   └── prisma.js                    # Prisma client
├── prisma/
│   └── schema.prisma                # Database schema
├── .env.example                     # Environment variables template
├── next.config.js                   # Next.js configuration
├── tailwind.config.js               # Tailwind configuration
└── package.json                     # Dependencies
```

---

## 🛠️ Setup Instructions

### Prerequisites

- Node.js 18+ installed
- A Neon PostgreSQL database account (free tier: https://neon.tech)
- A Cloudinary account (free tier: https://cloudinary.com)

### Step 1: Clone and Install

```bash
# Navigate to project directory
cd windhands

# Install dependencies
npm install
```

### Step 2: Configure Environment Variables

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Fill in your credentials in `.env`:

```env
# Get this from Neon Dashboard → Connection String
DATABASE_URL="postgresql://username:password@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require"

# Get these from Cloudinary Dashboard → Account Details
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"

# Generate a random string for session security
SESSION_SECRET="your-super-secret-random-string-here"
```

### Step 3: Setup Database

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database (creates tables)
npx prisma db push

# Optional: Open Prisma Studio to view database
npx prisma studio
```

### Step 4: Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` in your browser!

---

## 🎯 How It Works (End-to-End)

### **MODULE 1: Authentication System**

#### Registration Flow:
1. User fills form at `/register`
2. Form sends POST to `/api/auth/register`
3. Backend validates input (name, email, password)
4. Password is **hashed** using bcrypt (10 rounds)
5. User saved to PostgreSQL via Prisma
6. Redirects to login page

#### Login Flow:
1. User enters email & password at `/login`
2. Form sends POST to `/api/auth/login`
3. Backend finds user by email
4. bcrypt compares entered password with stored hash
5. If match: Creates cookie with `userId`
6. Redirects to `/feed`

#### Session Management:
- Uses HttpOnly cookies (secure, can't be accessed by JavaScript)
- Cookie expires after 7 days
- All protected pages check for valid `userId` cookie

---

### **MODULE 2: User Profile**

#### How Profile Works:
1. User visits `/profile`
2. Server reads `userId` from cookie
3. Fetches user data from database
4. Fetches user's reels (WHERE userId = currentUserId)
5. Displays profile info + grid of reels
6. If not authenticated → redirect to `/login`

**Key Component**: `getCurrentUser()` helper reads cookie and fetches user

---

### **MODULE 3: Reels System**

#### Upload Flow:
1. User selects video file at `/upload`
2. File validated (type, size < 50MB)
3. Form sends multipart/form-data to `/api/reels/upload`
4. Backend:
   - Converts file to buffer
   - Uploads to Cloudinary (gets video URL)
   - Saves reel to database with URL + caption + userId
5. Redirects to feed

#### Feed Display:
1. Server fetches all reels (ordered by newest first)
2. Each reel includes user info (via Prisma relation)
3. `ReelFeedItem` component:
   - Auto-plays when scrolled into view (Intersection Observer)
   - Muted by default
   - Click to pause/play
4. Videos stream from Cloudinary CDN

---

### **MODULE 4: UI & Features**

#### Light Theme Design:
- Gradient backgrounds (blue → purple → pink)
- White cards with soft shadows
- Rounded corners (xl = 16px)
- Hover effects with scale transforms
- Custom scrollbar styling

#### Security Features:
- Passwords hashed (never stored plain text)
- HttpOnly cookies prevent XSS attacks
- Protected routes redirect unauthenticated users
- Input validation on all forms
- Prisma prevents SQL injection

#### Component Reusability:
- `LogoutButton`: Shared across pages
- `ReelCard`: Grid layout for profile
- `ReelFeedItem`: Vertical feed layout
- `UploadForm`: Complex upload logic isolated

---

## 🗄️ Database Schema Explained

### User Model
```prisma
model User {
  id        String   @id @default(cuid())  // Random unique ID
  name      String                         // Display name
  email     String   @unique               // Login identifier
  password  String                         // Hashed password
  createdAt DateTime @default(now())       // Account creation date
  reels     Reel[]                         // Relation: user's reels
}
```

### Reel Model
```prisma
model Reel {
  id        String   @id @default(cuid())
  videoUrl  String                         // Cloudinary URL
  caption   String   @default("")          // Optional caption
  createdAt DateTime @default(now())
  userId    String                         // Foreign key to User
  user      User     @relation(...)        // Relation: reel owner
  
  @@index([userId])     // Fast queries by user
  @@index([createdAt])  // Fast sorting by date
}
```

**Relationship**: One-to-Many (One user → many reels)

---

## 🔐 Authentication Deep Dive

### Why bcrypt?
- Industry-standard password hashing
- Automatic salt generation (prevents rainbow table attacks)
- Slow by design (prevents brute-force attacks)
- 10 rounds = good balance of security vs. performance

### How Cookies Work:
```javascript
// Setting cookie (login)
response.cookies.set('userId', user.id, {
  httpOnly: true,      // Can't be read by JavaScript
  secure: true,        // HTTPS only (in production)
  sameSite: 'lax',     // CSRF protection
  maxAge: 60*60*24*7   // 7 days
})

// Reading cookie (protected pages)
const userId = cookies().get('userId')?.value
```

### Route Protection:
```javascript
// In any protected page
const user = await getCurrentUser()
if (!user) redirect('/login')
```

---

## 📤 Cloudinary Integration

### Why Cloudinary?
- Free tier (25GB storage, 25GB bandwidth/month)
- Automatic video optimization
- Fast CDN delivery worldwide
- Supports transformations (resize, quality adjust)

### Upload Process:
```javascript
// Convert file to buffer
const bytes = await video.arrayBuffer()
const buffer = Buffer.from(bytes)

// Upload using stream
cloudinary.uploader.upload_stream(
  { 
    resource_type: 'video',
    folder: 'reels',
    transformation: [
      { width: 720, crop: 'limit' },  // Max width
      { quality: 'auto' }              // Auto quality
    ]
  },
  (error, result) => {
    // result.secure_url is the video URL
  }
).end(buffer)
```

---

## 🎨 Tailwind Customization

Custom theme in `tailwind.config.js`:
```javascript
colors: {
  primary: '#6366f1',      // Indigo
  secondary: '#8b5cf6',    // Purple
  accent: '#ec4899',       // Pink
  lightBg: '#f8fafc',      // Very light gray
  cardBg: '#ffffff',       // White
}
```

Usage:
```jsx
<button className="bg-gradient-to-r from-primary to-secondary">
  Click Me
</button>
```

---

## 🚀 Deployment Guide

### Deploy to Vercel (Recommended)

1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin YOUR_GITHUB_URL
   git push -u origin main
   ```

2. **Connect to Vercel**:
   - Go to https://vercel.com
   - Import your GitHub repository
   - Add environment variables (DATABASE_URL, CLOUDINARY_*, SESSION_SECRET)
   - Deploy!

3. **Database Migration**:
   - Vercel automatically runs `prisma generate` on build
   - Run `npx prisma db push` locally before first deploy

---

## 🔧 Common Issues & Solutions

### Issue: "PrismaClient is unable to run in this browser environment"
**Solution**: Make sure you're using Prisma only in Server Components or API routes, never in Client Components.

### Issue: Video upload fails
**Solution**: 
- Check Cloudinary credentials in `.env`
- Verify file size < 50MB
- Check Cloudinary upload preset settings

### Issue: "Not authenticated" on protected pages
**Solution**:
- Clear cookies and login again
- Check if `DATABASE_URL` is correct
- Verify cookie is set (check browser DevTools → Application → Cookies)

### Issue: Database connection fails
**Solution**:
- Verify Neon database URL in `.env`
- Make sure `?sslmode=require` is at the end of the URL
- Run `npx prisma db push` to sync schema

---

## 🎁 Optional Enhancements (Future Features)

### Easy Additions:
1. **Like System**:
   - Add `Like` model with userId + reelId
   - Count likes per reel
   - Toggle like button

2. **Comments**:
   - Add `Comment` model
   - Display under each reel
   - Real-time with polling

3. **Delete Reel**:
   - Add DELETE API route
   - Button on user's own reels
   - Delete from Cloudinary too

4. **Profile Photo**:
   - Upload to Cloudinary
   - Add `profileImage` field to User model
   - Display in avatar

5. **Follow System**:
   - Add `Follow` model
   - Show followed users' reels
   - Follower/following count

### Advanced Features:
- Search functionality
- Hashtags
- Direct messaging
- Notifications
- Stories (24-hour videos)
- Share to other platforms

---

## 📚 Learning Resources

### For Beginners:

**Next.js App Router**:
- https://nextjs.org/docs/app

**Prisma Basics**:
- https://www.prisma.io/docs/getting-started

**Tailwind CSS**:
- https://tailwindcss.com/docs

**bcrypt**:
- https://www.npmjs.com/package/bcrypt

**Cloudinary**:
- https://cloudinary.com/documentation

---

## 🤝 Contributing

Feel free to fork this project and add your own features!

---

## 📄 License

MIT License - Free to use for learning and personal projects.

---

## 🙋 Support

If you encounter issues:
1. Check the "Common Issues" section above
2. Verify all environment variables are set
3. Check browser console for errors
4. Check terminal for server errors

---

**Built with ❤️ using Next.js, Prisma, and Tailwind CSS**
