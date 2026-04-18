# 🚀 CLOUDFLARE DEPLOYMENT GUIDE

Quick guide to deploy Paragu-AI Builder to Cloudflare Pages.

## ✅ Build Status: READY

Build completed successfully with **128 pages**:
- ✅ Main site (home, admin, API routes)
- ✅ 21 business types  
- ✅ Nexa Paraguay multi-locale site (nl, en, de, es)
- ✅ 10 blog posts
- ✅ Admin leads dashboard

## 🎯 Deployment Options

### Option 1: GitHub Integration (Easiest - 2 minutes)

**Best for:** Automated deployments on every git push

1. **Go to Cloudflare Dashboard**
   - https://dash.cloudflare.com
   - Sign up/login (free account works)

2. **Create Pages Project**
   - Click **Pages** → **Create a project**
   - Connect to Git: Select **GitHub**
   - Authorize Cloudflare to access your repos
   - Select: `Ai-Whisperers/paragu-ai-builder`

3. **Configure Build Settings**
   ```
   Project name: paragu-ai
   Production branch: Main
   
   Build settings:
   - Framework preset: Next.js
   - Build command: cd web && npm install && npm run build
   - Build output directory: web/.next
   - Root directory: (leave empty)
   ```

4. **Add Environment Variables**
   In the Cloudflare dashboard, add these (get from your Supabase project):
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

5. **Save and Deploy**
   - Click **Save and Deploy**
   - Wait 2-3 minutes for build
   - Your site will be live at `https://paragu-ai.pages.dev`

---

### Option 2: Wrangler CLI (Direct Upload)

**Best for:** Manual deployment without GitHub

1. **Install Wrangler**
   ```bash
   npm install -g wrangler
   ```

2. **Login to Cloudflare**
   ```bash
   npx wrangler login
   ```
   - This opens a browser to authenticate

3. **Create Project (if doesn't exist)**
   ```bash
   npx wrangler pages project create paragu-ai
   ```

4. **Deploy Build**
   ```bash
   cd /home/ai-whisperers/paragu-ai-builder/web
   npx wrangler pages deploy .next --project-name=paragu-ai --branch=main
   ```

---

### Option 3: Quick Script (I've prepared this)

**Run this command:**
```bash
cd /home/ai-whisperers/paragu-ai-builder/web
./deploy-cloudflare.sh
```

This script will:
- ✅ Check if you're authenticated
- ✅ Build the project  
- ✅ Deploy to Cloudflare
- ✅ Give you the live URL

---

## 🔧 Pre-Deployment Checklist

Before deploying, make sure:

- [ ] Supabase migration has been run (000_complete_schema.sql)
- [ ] Environment variables are correct
- [ ] Build passes locally (`npm run build`)
- [ ] You have Cloudflare account access

---

## 🌐 After Deployment

**Your site will be available at:**
- **Main:** `https://paragu-ai.pages.dev`
- **Admin:** `https://paragu-ai.pages.dev/admin/leads`
- **Nexa NL:** `https://paragu-ai.pages.dev/s/nl/nexa-paraguay`
- **Nexa ES:** `https://paragu-ai.pages.dev/s/es/nexa-paraguay`

---

## 🐛 If Nexa Shows 404

The Nexa pages may show 404 due to content resolution issues. To fix:

1. **Check if it's a content issue**
   ```bash
   curl https://paragu-ai.pages.dev/api/health
   ```

2. **Test Spanish version** (may work better)
   ```
   https://paragu-ai.pages.dev/s/es/nexa-paraguay
   ```

3. **Debug locally**
   ```bash
   cd web && npm run dev
   # Open http://localhost:3000/s/nl/nexa-paraguay
   # Check browser console for errors
   ```

---

## 📊 Monitoring

After deployment, check:
- [ ] Cloudflare Pages dashboard for build logs
- [ ] Supabase dashboard for connection stats  
- [ ] `/api/health` endpoint returns OK
- [ ] Admin dashboard loads (empty state is fine)

---

## 🔄 Continuous Deployment

With GitHub integration, every push to `Main` branch will auto-deploy!

**To enable:**
1. Go to Cloudflare Pages dashboard
2. Select your project
3. Settings → Build & Deployment
4. Enable "Automatic deployments"

---

## 🆘 Troubleshooting

**Build fails in Cloudflare but works locally?**
- Check environment variables are set in Cloudflare dashboard
- Ensure Supabase credentials are correct
- Check build logs in Cloudflare for specific errors

**Site shows 404 on all pages?**
- Check if `dist` or `.next` folder is correct in build settings
- Verify Next.js version compatibility
- Check Cloudflare Functions logs

**Database connection fails?**
- Verify Supabase URL includes `https://`
- Check if RLS policies allow the connection
- Test with local `curl` to Supabase REST API

---

## ✅ Success Criteria

Once deployed, verify these work:

```bash
# Test main site
curl https://paragu-ai.pages.dev/api/health
# Expected: {"status":"ok"}

# Test homepage loads
curl -s https://paragu-ai.pages.dev | grep -o "ParaguAI" | head -1

# Test Nexa redirects work
curl -I https://paragu-ai.pages.dev/nexa-paraguay
# Expected: HTTP 200 or redirect to /s/nl/nexa-paraguay
```

---

**Ready to deploy? Choose Option 1 (GitHub) for easiest setup, or run `./deploy-cloudflare.sh` for CLI method.**
