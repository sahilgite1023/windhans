# ⚡ QUICK START - Get Running in 5 Minutes

Follow these exact steps to get your app running.

---

## ✅ Pre-Flight Checklist

Before starting, make sure you have:
- [ ] Node.js 18+ installed ([Download](https://nodejs.org))
- [ ] A code editor (VS Code recommended)
- [ ] A terminal/command prompt open
- [ ] Internet connection

---

## 🚀 Step 1: Install Dependencies (2 minutes)

Open terminal in the project folder and run:

```bash
npm install
```

**What's happening?** Installing all required packages.

**Expected output**: 
```
added 250 packages in 45s
```

---

## 🔑 Step 2: Get Your Credentials (2 minutes)

### A. Neon Database (FREE)

1. Go to: https://neon.tech
2. Click "Sign Up" (use GitHub or email)
3. Create a new project (name: "windhands")
4. Copy the **Connection String**
   - Format: `postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require`

### B. Cloudinary (FREE)

1. Go to: https://cloudinary.com
2. Click "Sign Up" (use Google or email)
3. From Dashboard, copy:
   - **Cloud Name** (example: `dxyz123abc`)
   - **API Key** (example: `123456789012345`)
   - **API Secret** (example: `abc123xyz789`)

---

## 📝 Step 3: Create .env File (1 minute)

Create a file named `.env` in the root folder:

**Windows**: 
```bash
type nul > .env
notepad .env
```

**Mac/Linux**:
```bash
touch .env
nano .env
```

**Paste this** (replace with YOUR credentials):

```env
DATABASE_URL="postgresql://YOUR_NEON_CONNECTION_STRING_HERE"
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"
SESSION_SECRET="my-super-secret-random-string-123"
```

**Save and close** (Ctrl+S, then Ctrl+X in nano)

---

## 🗄️ Step 4: Setup Database (30 seconds)

Run these commands:

```bash
npx prisma generate
npx prisma db push
```

**What's happening?** Creating database tables.

**Expected output**:
```
✔ Generated Prisma Client
✔ Your database is now in sync with your schema.
```

---

## 🎉 Step 5: Start the App (10 seconds)

```bash
npm run dev
```

**Expected output**:
```
  ▲ Next.js 14.2.0
  - Local:        http://localhost:3000
  - Network:      http://192.168.1.5:3000

 ✓ Ready in 2.1s
```

---

## 🌐 Step 6: Open in Browser

Visit: **http://localhost:3000**

You should see the **landing page** with:
- "Windhands" title
- "Get Started" button
- "Sign In" button

---

## ✨ Step 7: Test the App

### Create Account
1. Click "Get Started"
2. Fill the form:
   - Name: `Your Name`
   - Email: `test@example.com`
   - Password: `password123`
3. Click "Sign Up"
4. You'll see "Account created! Please log in."

### Login
1. Enter same email and password
2. Click "Log In"
3. You're now at `/feed`!

### Upload Video
1. Click "Upload" in navigation
2. Click the upload area
3. Select a video (MP4, under 50MB)
4. Add caption (optional)
5. Click "Post Reel"
6. Video uploads to Cloudinary → saved to database → redirects to feed

### View Feed
- Your video appears in the feed
- Scroll near it → auto-plays
- Click video → pauses/plays

### Check Profile
1. Click "Profile" in navigation
2. See your info and reels
3. Grid of your videos

### Logout
1. Click "Logout"
2. Redirected to login page
3. Try accessing `/feed` → redirected to login (route protection works!)

---

## 🎯 Success Criteria

You're all set if:
- ✅ App runs on http://localhost:3000
- ✅ Can register new account
- ✅ Can login
- ✅ Can upload video
- ✅ Video appears in feed
- ✅ Profile shows your reels
- ✅ Logout works

---

## 🐛 Troubleshooting

### "Cannot find module"
```bash
rm -rf node_modules
npm install
```

### "Port 3000 already in use"
```bash
npx kill-port 3000
npm run dev
```

### "Prisma Client not generated"
```bash
npx prisma generate
npm run dev
```

### "Database connection error"
- Check your `DATABASE_URL` in `.env`
- Make sure it has `?sslmode=require` at the end
- Verify credentials from Neon dashboard

### "Cloudinary upload failed"
- Check credentials in `.env`
- Make sure there are no spaces
- Verify API key is correct

### Videos not playing
- Check browser console (F12)
- Try different video format (MP4)
- Check video file size (< 50MB)

---

## 📱 View on Mobile

1. Find your computer's IP address:
   ```bash
   ipconfig          # Windows
   ifconfig          # Mac/Linux
   ```

2. Look for something like: `192.168.1.5`

3. On phone's browser, visit:
   ```
   http://192.168.1.5:3000
   ```

4. Make sure phone is on same WiFi network!

---

## 🎨 Customize the App

### Change Colors
Edit `tailwind.config.js`:
```javascript
colors: {
  primary: '#6366f1',    // Change this!
  secondary: '#8b5cf6',  // And this!
}
```

### Change App Name
Edit `app/page.js` and other files:
```javascript
<h1>Your App Name</h1>
```

### Change Metadata
Edit `app/layout.js`:
```javascript
export const metadata = {
  title: 'Your App Name',
  description: 'Your description',
}
```

---

## 🚀 Next Steps

Now that it's working:

1. **Read the docs**:
   - README.md - Full documentation
   - BEGINNER_GUIDE.md - Learn concepts
   - ARCHITECTURE.md - Understand design

2. **Explore the code**:
   - Start with `app/page.js`
   - Check `app/api/` routes
   - Look at components

3. **Make changes**:
   - Change colors
   - Modify layouts
   - Add features

4. **Deploy**:
   - Push to GitHub
   - Deploy on Vercel
   - Share with friends!

---

## 📦 Useful Commands

```bash
# Stop server
Ctrl + C

# Restart server
npm run dev

# View database
npx prisma studio

# Check logs
# Just watch the terminal!

# Build for production
npm run build
```

---

## 💡 Pro Tips

1. **Keep terminal open** - You'll see errors there
2. **Check browser console** (F12) - Frontend errors show there
3. **Use Prisma Studio** (`npx prisma studio`) - Easy database viewing
4. **Save often** - Changes auto-reload
5. **Read error messages** - They usually tell you what's wrong

---

## 🎓 Learning Resources

### In This Project
- README.md - Main docs
- SETUP.md - Detailed setup
- BEGINNER_GUIDE.md - Concepts explained
- ARCHITECTURE.md - System design
- COMMANDS.md - All commands

### Official Docs
- Next.js: https://nextjs.org/docs
- Prisma: https://www.prisma.io/docs
- Tailwind: https://tailwindcss.com/docs

---

## 🎯 Common First-Time Issues

### 1. "npm is not recognized"
**Solution**: Install Node.js from https://nodejs.org

### 2. ".env file not found"
**Solution**: Create it manually (see Step 3)

### 3. "Database tables not created"
**Solution**: Run `npx prisma db push`

### 4. "Videos not uploading"
**Solution**: Check Cloudinary credentials

### 5. "Can't access /feed"
**Solution**: Login first!

---

## ✅ Final Checklist

Before you start coding:
- [ ] `npm install` completed successfully
- [ ] `.env` file created with all 5 variables
- [ ] `npx prisma generate` ran successfully
- [ ] `npx prisma db push` created tables
- [ ] `npm run dev` starts without errors
- [ ] http://localhost:3000 loads
- [ ] Can register account
- [ ] Can login
- [ ] Can upload video
- [ ] Video plays in feed

---

## 🎉 You're Ready!

If all checkboxes are ✅, you're good to go!

**Start exploring, learning, and building!** 🚀

---

## 📞 Need Help?

1. Check troubleshooting section above
2. Read SETUP.md for detailed help
3. Check browser console (F12)
4. Check terminal for errors
5. Re-read the step you're stuck on

---

**Total Time**: ~5 minutes
**Difficulty**: Beginner-friendly
**Result**: Working Instagram-style reels app! 

Let's build something amazing! 💪✨
