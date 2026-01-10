# COMMANDS REFERENCE - Quick Commands List

All the commands you'll need for this project.

---

## 🚀 Getting Started

### Initial Setup
```bash
# Navigate to project
cd windhands

# Install all dependencies
npm install

# Create .env file (copy from example)
cp .env.example .env
# Then edit .env with your credentials

# Generate Prisma client
npx prisma generate

# Create database tables
npx prisma db push

# Start development server
npm run dev
```

**Visit**: http://localhost:3000

---

## 📦 NPM Commands

### Development
```bash
# Start dev server (hot reload enabled)
npm run dev

# Start on different port
npm run dev -- -p 3001
```

### Production
```bash
# Build for production
npm run build

# Run production build locally
npm run start

# Lint code
npm run lint
```

### Dependencies
```bash
# Install all dependencies
npm install

# Install specific package
npm install package-name

# Install as dev dependency
npm install --save-dev package-name

# Update dependencies
npm update

# Check outdated packages
npm outdated

# Clean install (removes node_modules)
rm -rf node_modules
npm install
```

---

## 🗄️ Prisma Commands

### Database Management
```bash
# Generate Prisma client (after schema changes)
npx prisma generate

# Push schema to database (development)
npx prisma db push

# Create migration (production)
npx prisma migrate dev --name migration_name

# Apply migrations (production)
npx prisma migrate deploy

# Reset database (⚠️ deletes all data!)
npx prisma migrate reset

# Open Prisma Studio (database GUI)
npx prisma studio
```

### Schema Validation
```bash
# Validate schema syntax
npx prisma validate

# Format schema file
npx prisma format

# Check schema against database
npx prisma db pull
```

---

## 🐛 Debugging Commands

### Check Versions
```bash
# Node version
node --version

# npm version
npm --version

# Next.js version
npx next --version

# Check if port is in use
netstat -ano | findstr :3000    # Windows
lsof -i :3000                    # Mac/Linux
```

### Kill Port Process
```bash
# Kill port 3000 (Windows)
npx kill-port 3000

# Kill port 3000 (Mac/Linux)
lsof -ti:3000 | xargs kill -9
```

### Clear Cache
```bash
# Clear Next.js cache
rm -rf .next

# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear all build artifacts
rm -rf .next node_modules package-lock.json
npm install
```

---

## 🔍 Database Inspection

### Using Prisma Studio
```bash
# Open GUI (runs on http://localhost:5555)
npx prisma studio
```

### Using SQL (if needed)
```bash
# Connect to database (from .env DATABASE_URL)
# Use any PostgreSQL client or pgAdmin
```

---

## 🌐 Environment Management

### Environment Variables
```bash
# Development (.env)
DATABASE_URL=...
CLOUDINARY_CLOUD_NAME=...

# Production (set in hosting platform)
# Vercel: Settings → Environment Variables
# Railway: Variables tab
# Render: Environment section
```

### Generate Secure Secret
```bash
# Generate random session secret
openssl rand -base64 32
```

---

## 🧪 Testing Commands

### Manual Testing Checklist
```bash
# 1. Can register new user?
# Open http://localhost:3000/register

# 2. Can login?
# Open http://localhost:3000/login

# 3. Can access feed when logged in?
# Open http://localhost:3000/feed

# 4. Redirects to login when logged out?
# Clear cookies → try accessing /feed

# 5. Can upload video?
# Open http://localhost:3000/upload

# 6. Videos display correctly?
# Check /feed for uploaded videos

# 7. Profile shows user reels?
# Open http://localhost:3000/profile

# 8. Logout works?
# Click logout → should redirect to login
```

---

## 🚀 Deployment Commands

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

### Manual Build
```bash
# Build for production
npm run build

# Test production build locally
npm run start
```

---

## 🔧 Git Commands

### Initial Setup
```bash
# Initialize git
git init

# Add all files
git add .

# First commit
git commit -m "Initial commit"

# Connect to GitHub
git remote add origin https://github.com/username/repo.git

# Push to GitHub
git push -u origin main
```

### Regular Workflow
```bash
# Check status
git status

# Add changed files
git add .

# Commit with message
git commit -m "Your message"

# Push to GitHub
git push

# Pull latest changes
git pull
```

### Undo Changes
```bash
# Undo uncommitted changes (single file)
git checkout -- filename

# Undo all uncommitted changes
git reset --hard

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes)
git reset --hard HEAD~1
```

---

## 📁 File Management

### Create New Files
```bash
# Create component
touch components/NewComponent.js

# Create page
mkdir app/newpage
touch app/newpage/page.js

# Create API route
mkdir -p app/api/newroute
touch app/api/newroute/route.js
```

### View Files
```bash
# List all files
ls -la              # Mac/Linux
dir                 # Windows

# Show file contents
cat filename        # Mac/Linux
type filename       # Windows

# Find files
find . -name "*.js"                    # Mac/Linux
Get-ChildItem -Recurse -Filter "*.js"  # Windows PowerShell
```

---

## 🔍 Troubleshooting Commands

### Port Already in Use
```bash
# Find process using port 3000
lsof -i :3000              # Mac/Linux
netstat -ano | findstr :3000   # Windows

# Kill the process
kill -9 PID                # Mac/Linux (replace PID)
taskkill /PID PID /F       # Windows (replace PID)

# Or use helper
npx kill-port 3000
```

### Module Not Found
```bash
# Reinstall dependencies
rm -rf node_modules
npm install

# Clear npm cache
npm cache clean --force
npm install
```

### Prisma Errors
```bash
# Regenerate Prisma client
npx prisma generate

# Reset database
npx prisma migrate reset

# Pull current database schema
npx prisma db pull
```

### Build Errors
```bash
# Clear Next.js cache
rm -rf .next

# Rebuild
npm run build
```

---

## 📊 Monitoring Commands

### Check Running Processes
```bash
# Show all Node processes
ps aux | grep node         # Mac/Linux
tasklist | findstr node    # Windows
```

### Check Disk Space
```bash
# Check node_modules size
du -sh node_modules        # Mac/Linux
```

### View Logs
```bash
# View real-time logs (when running npm run dev)
# Just check the terminal where it's running

# Save logs to file
npm run dev > logs.txt 2>&1
```

---

## 🛠️ Maintenance Commands

### Update Next.js
```bash
# Check current version
npm list next

# Update to latest
npm install next@latest react@latest react-dom@latest

# Update Prisma
npm install @prisma/client@latest
npm install -D prisma@latest
npx prisma generate
```

### Security Audit
```bash
# Check for vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix

# Force fix (may break things)
npm audit fix --force
```

---

## 📱 Mobile Development

### Test on Mobile Device
```bash
# Start dev server
npm run dev

# Find your local IP
ipconfig                   # Windows
ifconfig                   # Mac/Linux

# Access from phone
# http://YOUR_IP:3000
# Example: http://192.168.1.5:3000
```

---

## 🎯 Common Workflows

### Adding a New Feature
```bash
# 1. Create feature branch
git checkout -b feature/new-feature

# 2. Make changes
# Edit files...

# 3. Test locally
npm run dev

# 4. Commit changes
git add .
git commit -m "Add new feature"

# 5. Push to GitHub
git push origin feature/new-feature

# 6. Create Pull Request on GitHub
```

### Fixing a Bug
```bash
# 1. Create fix branch
git checkout -b fix/bug-name

# 2. Fix the bug
# Edit files...

# 3. Test the fix
npm run dev

# 4. Commit and push
git add .
git commit -m "Fix bug: description"
git push origin fix/bug-name
```

---

## 🔄 Reset Everything (Fresh Start)

```bash
# Stop dev server (Ctrl+C)

# Remove all generated files
rm -rf node_modules
rm -rf .next
rm package-lock.json

# Reinstall
npm install

# Regenerate Prisma
npx prisma generate

# Reset database (⚠️ deletes data)
npx prisma migrate reset

# Start fresh
npm run dev
```

---

## 📋 Pre-Deployment Checklist

```bash
# ✅ All environment variables set
# ✅ Database URL configured
# ✅ Cloudinary credentials added
# ✅ Build succeeds
npm run build

# ✅ Production build runs
npm run start

# ✅ All pages accessible
# ✅ Authentication works
# ✅ Upload works
# ✅ Videos play correctly
# ✅ Mobile responsive
# ✅ No console errors
# ✅ Secrets not in code
# ✅ .env in .gitignore
```

---

## 🎓 Learning Commands

### Explore Package
```bash
# View package info
npm info package-name

# View package versions
npm view package-name versions

# Open package documentation
npm docs package-name
```

### Code Quality
```bash
# Check for linting errors
npm run lint

# Auto-fix linting errors
npm run lint -- --fix
```

---

## 💡 Pro Tips

```bash
# Use aliases for common commands
# Add to .bashrc or .zshrc:
alias nd="npm run dev"
alias nb="npm run build"
alias pg="npx prisma generate"
alias ps="npx prisma studio"

# Then just type:
nd  # instead of npm run dev
```

---

## 📞 Getting Help

```bash
# Next.js documentation
npm docs next

# Prisma documentation
npm docs @prisma/client

# View command help
npm help
git --help
npx prisma --help
```

---

**Keep this file handy for quick reference!** 📌
