# SETUP GUIDE - QUICK START

## 🎯 Complete Setup in 5 Minutes

### STEP 1: Install Dependencies
```bash
npm install
```

### STEP 2: Get Neon Database URL
1. Go to https://neon.tech
2. Sign up (free)
3. Create new project
4. Copy "Connection String" from dashboard
5. Should look like:
   ```
   postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```

### STEP 3: Get Cloudinary Credentials
1. Go to https://cloudinary.com
2. Sign up (free)
3. From Dashboard, copy:
   - Cloud Name
   - API Key
   - API Secret

### STEP 4: Create .env File
Create a file named `.env` in the root directory:

```env
# Neon Database
DATABASE_URL="postgresql://your-connection-string-here"

# Cloudinary
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"

# Session (any random string)
SESSION_SECRET="my-super-secret-key-123"
```

### STEP 5: Setup Database
```bash
npx prisma generate
npx prisma db push
```

### STEP 6: Run the App
```bash
npm run dev
```

Visit http://localhost:3000

---

## ✅ Verification Checklist

- [ ] Node.js 18+ installed
- [ ] All dependencies installed (`npm install`)
- [ ] `.env` file created with all 4 variables
- [ ] Database URL tested (run `npx prisma studio`)
- [ ] Cloudinary credentials correct
- [ ] Database migrated (`npx prisma db push`)
- [ ] Dev server running (`npm run dev`)

---

## 🎬 First Steps After Setup

1. **Register an Account**:
   - Go to http://localhost:3000
   - Click "Get Started"
   - Fill registration form

2. **Upload Your First Reel**:
   - Click "Upload" in navigation
   - Select a video (max 50MB)
   - Add caption (optional)
   - Post!

3. **View Feed**:
   - Videos auto-play when scrolled
   - Click to pause/play
   - All reels shown newest first

4. **Check Profile**:
   - View your uploaded reels
   - See account info
   - Logout when done

---

## 🐛 Troubleshooting

### Database Connection Error:
- Make sure DATABASE_URL has `?sslmode=require` at the end
- Check Neon dashboard for correct connection string
- Verify no extra spaces in `.env` file

### Video Upload Not Working:
- Check Cloudinary credentials
- Make sure video is under 50MB
- Try MP4 format
- Check browser console for errors

### Can't Login After Registration:
- Check if user was created in database (`npx prisma studio`)
- Clear browser cookies
- Try different browser
- Check terminal for errors

### Port 3000 Already in Use:
```bash
# Kill the process
npx kill-port 3000

# Or use different port
npm run dev -- -p 3001
```

---

## 📦 Package Versions

If you encounter dependency issues, here are the tested versions:

```json
{
  "next": "14.2.0",
  "react": "18.3.0",
  "@prisma/client": "5.18.0",
  "bcrypt": "5.1.1",
  "cloudinary": "2.4.0",
  "tailwindcss": "3.4.3"
}
```

---

## 🎓 Understanding the Code Structure

### Pages (User-Facing):
- `/` - Landing page
- `/register` - Create account
- `/login` - Sign in
- `/feed` - View all reels
- `/profile` - Your profile & reels
- `/upload` - Post new reel

### API Routes (Backend):
- `/api/auth/register` - Create user
- `/api/auth/login` - Authenticate
- `/api/auth/logout` - End session
- `/api/auth/me` - Get current user
- `/api/reels` - Get all reels
- `/api/reels/upload` - Upload video

### Components (Reusable):
- `LogoutButton` - Sign out functionality
- `UploadForm` - Video upload form
- `ReelCard` - Grid view reel
- `ReelFeedItem` - Feed view reel

### Libraries (Utilities):
- `lib/prisma.js` - Database client
- `lib/cloudinary.js` - Video uploads
- `lib/auth.js` - Authentication helpers

---

## 🚀 Production Deployment

### Environment Variables for Production:
1. Set `NODE_ENV=production`
2. Use strong `SESSION_SECRET` (generate with: `openssl rand -base64 32`)
3. Verify Cloudinary limits for your plan
4. Check Neon database connection limits

### Recommended Hosting:
- **Vercel** (best for Next.js)
- **Railway**
- **Render**
- **Netlify**

All support Next.js App Router out of the box!

---

## 📞 Need Help?

1. Read the main README.md
2. Check Prisma Studio for data issues
3. Look at browser console (F12)
4. Check terminal for server errors
5. Google the specific error message

---

**Happy Coding! 🎉**
