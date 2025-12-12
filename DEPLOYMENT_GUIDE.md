# 🚀 GitHub Pages Deployment Guide

## Battery Monitoring Dashboard - Free Hosting Setup

This guide will help you deploy your Battery Monitoring Dashboard to GitHub Pages for **FREE**.

---

## 📋 Prerequisites

Before you begin, make sure you have:
- ✅ A GitHub account ([Sign up here](https://github.com/signup))
- ✅ Git installed on your computer
- ✅ Your project files ready

---

## 🛠️ Setup Steps

### Step 1: Create a GitHub Repository

1. **Go to GitHub**: Visit [github.com](https://github.com)
2. **Create New Repository**:
   - Click the `+` icon in the top right
   - Select "New repository"
3. **Configure Repository**:
   - **Repository name**: `battery-monitoring-dashboard` (or your preferred name)
   - **Description**: "Real-time Battery Charging Station Monitor and Rover Tracking System"
   - **Visibility**: Public (required for free GitHub Pages)
   - **DO NOT** initialize with README (your project already has files)
4. **Click** "Create repository"

### Step 2: Update Configuration (Already Done!)

Your project is already configured for GitHub Pages deployment:

✅ **gh-pages package** installed
✅ **vite.config.js** updated with base path
✅ **package.json** includes deploy scripts

**IMPORTANT**: If your repository name is different from `battery-monitoring-dashboard`, update `vite.config.js`:

```javascript
// vite.config.js
export default defineConfig({
  plugins: [react()],
  base: '/your-repository-name/', // Change this!
})
```

### Step 3: Initialize Git & Push to GitHub

Open your terminal in the project directory and run:

```bash
# Initialize git repository (if not already initialized)
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial commit - Battery Monitoring Dashboard"

# Add GitHub repository as remote
# Replace YOUR-USERNAME and YOUR-REPO-NAME with your actual values
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git

# Push to GitHub
git branch -M main
git push -u origin main
```

**Example**:
```bash
git remote add origin https://github.com/ravishan/battery-monitoring-dashboard.git
```

### Step 4: Deploy to GitHub Pages

Once your code is on GitHub, deploy with one simple command:

```bash
npm run deploy
```

This will:
1. Build your production-ready app (`npm run build`)
2. Create a `gh-pages` branch
3. Push the build to GitHub Pages
4. Make your site live!

### Step 5: Enable GitHub Pages

1. **Go to your repository** on GitHub
2. **Click** "Settings" tab
3. **Click** "Pages" in the left sidebar
4. **Under "Source"**:
   - Branch: `gh-pages`
   - Folder: `/ (root)`
5. **Click** "Save"

### Step 6: Access Your Live Site

Your app will be available at:
```
https://YOUR-USERNAME.github.io/YOUR-REPO-NAME/
```

**Example**:
```
https://ravishan.github.io/battery-monitoring-dashboard/
```

⏱️ **Note**: It may take 1-2 minutes for your site to be live after first deployment.

---

## 🔄 Updating Your Site

Whenever you make changes and want to update the live site:

```bash
# 1. Save your changes
git add .
git commit -m "Description of your changes"
git push origin main

# 2. Deploy the updates
npm run deploy
```

**That's it!** Your live site will update within 1-2 minutes.

---

## 📂 Project Structure for Deployment

```
battery-monitoring-dashboard/
├── dist/                    # Built files (created by npm run build)
├── public/                  # Static assets
├── src/                     # Source code
├── package.json            # With deploy scripts ✓
├── vite.config.js          # With base path ✓
└── index.html              # Entry point
```

---

## 🎯 Quick Commands Reference

| Command | Description |
|---------|-------------|
| `npm run dev` | Run development server locally |
| `npm run build` | Build production files |
| `npm run preview` | Preview production build locally |
| `npm run deploy` | Deploy to GitHub Pages |

---

## 🐛 Troubleshooting

### Issue: Blank Page After Deployment

**Solution**: Check your `base` path in `vite.config.js`

```javascript
// Make sure this matches your repository name
base: '/battery-monitoring-dashboard/',
```

### Issue: 404 Error

**Solution**:
1. Verify GitHub Pages is enabled in repository settings
2. Check that `gh-pages` branch exists
3. Wait 1-2 minutes for deployment to complete

### Issue: Images Not Loading

**Solution**: Make sure all image paths in your code use relative paths:
```javascript
// ✓ Good
<img src="/images/logo.png" />

// ✗ Bad
<img src="C:/Users/project/images/logo.png" />
```

### Issue: CSS Not Applying

**Solution**: Clear browser cache (Ctrl + Shift + R) or try incognito mode

### Issue: Deploy Command Fails

**Solutions**:
```bash
# 1. Reinstall gh-pages
npm install gh-pages --save-dev

# 2. Clear npm cache
npm cache clean --force

# 3. Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# 4. Try deploying again
npm run deploy
```

---

## 🔒 Making Your Repository Private (Paid Feature)

If you want a private repository with GitHub Pages, you need:
- GitHub Pro ($4/month)
- GitHub Team ($4/user/month)
- GitHub Enterprise

**For free hosting, keep your repository public.**

---

## 🌟 Custom Domain (Optional)

To use your own domain (e.g., `battery-monitor.com`):

1. **Buy a domain** (from Namecheap, GoDaddy, etc.)
2. **Add `CNAME` file** to your `public` folder:
   ```
   yourdomain.com
   ```
3. **Configure DNS** with your domain provider:
   ```
   Type: CNAME
   Host: www (or @)
   Value: YOUR-USERNAME.github.io
   ```
4. **Update GitHub Pages settings** with your custom domain
5. **Redeploy**: `npm run deploy`

---

## 📊 Monitoring Your Site

### Check Deployment Status
- Go to repository → "Actions" tab
- See all deployments and their status

### View Live Site Analytics
- Enable Google Analytics
- Or use GitHub's Insights tab

---

## 🎨 Optimization Tips

### 1. Reduce Bundle Size
```bash
npm run build

# Check dist/ folder size
# Optimize large images before deploying
```

### 2. Enable Caching
GitHub Pages automatically caches static assets.

### 3. Image Optimization
Use tools like [TinyPNG](https://tinypng.com/) to compress images before committing.

---

## 🆘 Need Help?

- **GitHub Pages Docs**: [docs.github.com/pages](https://docs.github.com/pages)
- **Vite Deployment Guide**: [vitejs.dev/guide/static-deploy](https://vitejs.dev/guide/static-deploy)
- **Check Issues**: Visit repository Issues tab

---

## ✅ Deployment Checklist

Before deploying, verify:

- [ ] All changes committed to Git
- [ ] `vite.config.js` has correct base path
- [ ] `npm run build` works without errors
- [ ] Repository is public on GitHub
- [ ] GitHub Pages enabled in repository settings
- [ ] Deployed using `npm run deploy`
- [ ] Waited 1-2 minutes for deployment
- [ ] Tested live URL

---

## 🎉 Success!

Your Battery Monitoring Dashboard is now live and accessible worldwide for FREE!

**Share your live URL**:
```
https://YOUR-USERNAME.github.io/YOUR-REPO-NAME/
```

---

## 📝 Quick Start Example

Complete workflow from start to finish:

```bash
# 1. Navigate to your project
cd battery-monitoring-dashboard

# 2. Initialize and commit
git init
git add .
git commit -m "Initial commit"

# 3. Connect to GitHub (create repo first!)
git remote add origin https://github.com/YOUR-USERNAME/battery-monitoring-dashboard.git
git push -u origin main

# 4. Deploy to GitHub Pages
npm run deploy

# 5. Enable GitHub Pages in repository settings

# Done! Your site is live! 🚀
```

---

**Made with ❤️ | Battery Monitoring Dashboard**
**Version 1.0.0 | 2025**
