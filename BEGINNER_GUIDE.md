# BEGINNER'S GUIDE - Understanding the Code

This guide explains the key concepts for someone new to web development.

---

## 🎓 Core Concepts Explained

### What is Next.js?
Next.js is a **React framework** that makes building web apps easier. It handles:
- Routing (which page to show)
- Server-side rendering (fast page loads)
- API routes (backend functionality)
- Image optimization
- Much more!

**Why use Next.js?**
- Fast performance out of the box
- SEO-friendly (search engines can read your pages)
- Easy deployment
- Great developer experience

---

### What is the App Router?
The **App Router** is Next.js's modern way of organizing pages:

```
app/
├── page.js           → Home page (/)
├── feed/
│   └── page.js       → Feed page (/feed)
├── profile/
│   └── page.js       → Profile page (/profile)
└── api/
    └── auth/
        └── login/
            └── route.js  → API endpoint (/api/auth/login)
```

**Rule**: Each `page.js` becomes a webpage!

---

### Server Components vs Client Components

**Server Components** (default):
```javascript
// app/feed/page.js
// No 'use client' = Server Component

export default async function FeedPage() {
  // Can fetch data here directly!
  const reels = await prisma.reel.findMany()
  
  return <div>{reels.map(...)}</div>
}
```
- Runs on the server
- Can access database directly
- No JavaScript sent to browser (faster!)
- Can't use useState, onClick, etc.

**Client Components** (interactive):
```javascript
// components/UploadForm.js
'use client'  // ← This makes it a Client Component

export default function UploadForm() {
  const [file, setFile] = useState(null)  // ✅ Can use hooks
  
  return <button onClick={...}>Upload</button>  // ✅ Can have events
}
```
- Runs in the browser
- Can use React hooks
- Can handle user interactions
- Use for forms, buttons, animations

---

## 🔐 Authentication Simplified

### How Passwords Work

**❌ NEVER DO THIS:**
```javascript
// Storing password as plain text
password: "mypassword123"  // Anyone with DB access can see it!
```

**✅ DO THIS:**
```javascript
// Hashing the password
import bcrypt from 'bcrypt'

// When user registers:
const hashedPassword = await bcrypt.hash("mypassword123", 10)
// Result: "$2b$10$abcd...xyz" (impossible to reverse)

// When user logs in:
const isMatch = await bcrypt.compare("mypassword123", hashedPassword)
// Returns true or false
```

**Why hash?**
- Even if database is leaked, passwords are safe
- bcrypt adds "salt" (random data) to make each hash unique
- Designed to be slow (prevents brute-force attacks)

---

### How Sessions Work

**What is a session?**
A way to "remember" a logged-in user across different pages.

**Using Cookies:**
```javascript
// After successful login:
response.cookies.set('userId', user.id, {
  httpOnly: true,    // JavaScript can't read it (security)
  maxAge: 604800,    // Expires in 7 days
})

// On protected pages:
const userId = cookies().get('userId')?.value
if (!userId) redirect('/login')  // Not logged in!
```

**Flow:**
1. User logs in → Server creates cookie
2. Browser stores cookie
3. Every request includes cookie
4. Server checks cookie to identify user

---

## 🗄️ Database Basics (Prisma + PostgreSQL)

### What is Prisma?
Prisma is an **ORM** (Object-Relational Mapping) that makes database work easier.

**Without Prisma (SQL):**
```sql
SELECT * FROM users WHERE email = 'john@example.com';
```

**With Prisma (JavaScript):**
```javascript
const user = await prisma.user.findUnique({
  where: { email: 'john@example.com' }
})
```

**Benefits:**
- Write JavaScript instead of SQL
- Type-safe (catches errors before running)
- Automatic migrations
- Prevents SQL injection

---

### Database Schema Explained

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  reels     Reel[]   // ← Relationship
}

model Reel {
  id        String   @id @default(cuid())
  videoUrl  String
  userId    String
  user      User     @relation(fields: [userId], references: [id])
}
```

**What this means:**
- Each User has a unique `id` (auto-generated)
- Email must be unique (can't register twice)
- One User can have many Reels
- Each Reel belongs to one User (via `userId`)

**Creating data:**
```javascript
// Create a user
await prisma.user.create({
  data: {
    email: 'john@example.com',
    password: hashedPassword,
  }
})

// Create a reel
await prisma.reel.create({
  data: {
    videoUrl: 'https://...',
    userId: user.id,
  }
})

// Get user WITH their reels
const user = await prisma.user.findUnique({
  where: { id: userId },
  include: { reels: true }  // ← Fetch related data
})
```

---

## ☁️ Cloudinary for Videos

### Why not store videos in the database?
- Videos are HUGE (50MB each)
- Databases are for structured data, not files
- CDNs deliver files faster worldwide

### How Cloudinary Works:

```javascript
// 1. User uploads video
const file = formData.get('video')

// 2. Convert to buffer
const bytes = await file.arrayBuffer()
const buffer = Buffer.from(bytes)

// 3. Upload to Cloudinary
const result = await cloudinary.uploader.upload_stream(...)
// Returns: { secure_url: 'https://res.cloudinary.com/...' }

// 4. Save URL in database (not the actual video!)
await prisma.reel.create({
  data: { videoUrl: result.secure_url }
})

// 5. To display video:
<video src={reel.videoUrl} />  // Loads from Cloudinary CDN
```

---

## 🎨 Tailwind CSS Explained

### What is Tailwind?
**Utility-first CSS framework** - style with pre-made classes.

**Traditional CSS:**
```css
.my-button {
  background-color: blue;
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
}
```
```html
<button class="my-button">Click</button>
```

**Tailwind Way:**
```html
<button class="bg-blue-500 text-white px-6 py-3 rounded-lg">
  Click
</button>
```

**Common Classes:**
```
bg-blue-500       → Blue background
text-white        → White text
px-6              → Horizontal padding (1.5rem)
py-3              → Vertical padding (0.75rem)
rounded-lg        → Large border radius
hover:bg-blue-600 → Darker on hover
w-full            → Full width
flex              → Flexbox container
gap-4             → Space between items
```

**Responsive Design:**
```html
<div class="
  w-full          /* Full width on mobile */
  md:w-1/2        /* Half width on medium screens */
  lg:w-1/3        /* 1/3 width on large screens */
">
  Content
</div>
```

---

## 📡 API Routes Explained

### What is an API?
**Application Programming Interface** - a way for your frontend to talk to your backend.

### Creating an API Route:

**File:** `app/api/hello/route.js`
```javascript
import { NextResponse } from 'next/server'

// Handle GET requests to /api/hello
export async function GET(request) {
  return NextResponse.json({ message: 'Hello!' })
}

// Handle POST requests to /api/hello
export async function POST(request) {
  const body = await request.json()
  return NextResponse.json({ received: body })
}
```

**Using the API from frontend:**
```javascript
// GET request
const response = await fetch('/api/hello')
const data = await response.json()
console.log(data.message)  // "Hello!"

// POST request
const response = await fetch('/api/hello', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'John' })
})
const data = await response.json()
console.log(data.received)  // { name: 'John' }
```

---

## 🔄 React Hooks Basics

### useState - Store Data
```javascript
const [count, setCount] = useState(0)

// Read: count
// Update: setCount(count + 1)

<button onClick={() => setCount(count + 1)}>
  Clicked {count} times
</button>
```

### useEffect - Run Code After Render
```javascript
useEffect(() => {
  console.log('Component loaded!')
  
  // Cleanup function (runs when component unmounts)
  return () => console.log('Component removed!')
}, [])  // Empty array = run once
```

### useRef - Reference DOM Elements
```javascript
const videoRef = useRef(null)

// Access the actual video element
const playVideo = () => {
  videoRef.current.play()
}

<video ref={videoRef} src="..." />
```

---

## 🚀 Async/Await Explained

**What is async code?**
Operations that take time (database queries, API calls, file uploads).

**Without async/await (callback hell):**
```javascript
fetch('/api/data')
  .then(response => response.json())
  .then(data => {
    fetch(`/api/more/${data.id}`)
      .then(response => response.json())
      .then(moreData => {
        // Do something...
      })
  })
```

**With async/await (clean):**
```javascript
async function fetchData() {
  const response = await fetch('/api/data')
  const data = await response.json()
  
  const moreResponse = await fetch(`/api/more/${data.id}`)
  const moreData = await moreResponse.json()
  
  return moreData
}
```

**Error Handling:**
```javascript
try {
  const data = await fetchData()
  console.log(data)
} catch (error) {
  console.error('Something went wrong:', error)
}
```

---

## 📦 Environment Variables

### What are .env files?
Files that store **secret information** (passwords, API keys).

**Why use them?**
- Keep secrets out of code
- Different values for development vs production
- Easy to change without editing code

**Example `.env`:**
```env
DATABASE_URL="postgresql://..."
CLOUDINARY_API_KEY="123456"
```

**Using in code:**
```javascript
const dbUrl = process.env.DATABASE_URL
const apiKey = process.env.CLOUDINARY_API_KEY
```

**⚠️ Security:**
- Never commit `.env` to Git
- Add to `.gitignore`
- Use different values for production

---

## 🛣️ Routing in Next.js

### File-System Routing

```
app/
├── page.js                    → /
├── about/
│   └── page.js                → /about
├── blog/
│   ├── page.js                → /blog
│   └── [id]/
│       └── page.js            → /blog/123 (dynamic)
└── api/
    └── users/
        └── route.js           → /api/users
```

### Dynamic Routes:
```javascript
// app/blog/[id]/page.js

export default function BlogPost({ params }) {
  const { id } = params  // id from URL
  
  return <h1>Post #{id}</h1>
}

// /blog/5 → shows "Post #5"
// /blog/abc → shows "Post #abc"
```

---

## 🎯 Common Patterns

### Loading States:
```javascript
const [loading, setLoading] = useState(false)

const handleSubmit = async () => {
  setLoading(true)
  try {
    await submitData()
  } finally {
    setLoading(false)  // Always reset
  }
}

<button disabled={loading}>
  {loading ? 'Saving...' : 'Save'}
</button>
```

### Error Handling:
```javascript
const [error, setError] = useState('')

try {
  await doSomething()
} catch (err) {
  setError(err.message)
}

{error && (
  <div className="bg-red-100 text-red-700 p-4">
    {error}
  </div>
)}
```

### Form Handling:
```javascript
const [formData, setFormData] = useState({
  email: '',
  password: '',
})

const handleChange = (e) => {
  setFormData({
    ...formData,
    [e.target.name]: e.target.value
  })
}

<input
  name="email"
  value={formData.email}
  onChange={handleChange}
/>
```

---

## 🔍 Debugging Tips

### Console Logging:
```javascript
console.log('Value:', myVariable)
console.error('Error:', error)
console.table(arrayOfObjects)  // Nice table view
```

### Browser DevTools:
- **F12** to open
- **Console tab**: See logs and errors
- **Network tab**: See API requests
- **Application tab**: View cookies
- **Elements tab**: Inspect HTML/CSS

### Server Logs:
Check your terminal where `npm run dev` is running for backend errors.

---

## 📚 Next Steps

1. **Understand each file** - Read through the code with comments
2. **Make small changes** - Change colors, text, layouts
3. **Add features** - Start with simple ones (like button)
4. **Break things** - Best way to learn (you can always reset)
5. **Read documentation** - Next.js, Prisma, Tailwind docs
6. **Build projects** - Practice makes perfect!

---

## 💡 Key Takeaways

- **Next.js** handles routing and server stuff
- **Server Components** for data, **Client Components** for interactivity
- **Prisma** makes database work easy
- **bcrypt** keeps passwords safe
- **Cookies** remember logged-in users
- **Tailwind** makes styling fast
- **Async/await** handles slow operations
- **.env** keeps secrets safe

---

**Remember:** Every expert was once a beginner. Take your time, experiment, and have fun! 🚀
