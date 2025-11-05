# SlotSwapper Deployment Guide

This guide will help you deploy SlotSwapper to production. We'll use:
- **Backend**: Render (or Railway/Heroku)
- **Frontend**: Vercel (or Netlify)
- **Database**: MongoDB Atlas (free tier available)

## Prerequisites

1. GitHub account (recommended) or GitLab
2. MongoDB Atlas account (free): https://www.mongodb.com/cloud/atlas
3. Render account (free): https://render.com
4. Vercel account (free): https://vercel.com

---

## Step 1: Set Up MongoDB Atlas (Database)

1. **Create MongoDB Atlas Account**
   - Go to https://www.mongodb.com/cloud/atlas
   - Sign up for free account

2. **Create a Cluster**
   - Click "Create" → Choose "Free" tier (M0)
   - Select a cloud provider and region
   - Click "Create Cluster" (takes 3-5 minutes)

3. **Create Database User**
   - Go to "Database Access" → "Add New Database User"
   - Choose "Password" authentication
   - Username: `slotswapper` (or your choice)
   - Password: Generate a secure password (save it!)
   - Click "Add User"

4. **Whitelist IP Address**
   - Go to "Network Access" → "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0) for simplicity
   - Or add specific IPs for better security

5. **Get Connection String**
   - Go to "Database" → Click "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - It looks like: `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`
   - Replace `<username>` and `<password>` with your database user credentials
   - Add database name: `mongodb+srv://.../?retryWrites=true&w=majority&appName=slotswapper`
   - Save this string - you'll need it for backend deployment

---

## Step 2: Deploy Backend to Render

### Option A: Deploy via GitHub (Recommended)

1. **Push Code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Create Render Web Service**
   - Go to https://render.com → Sign up/Login
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Select your repository

3. **Configure Render Service**
   - **Name**: `slotswapper-backend` (or your choice)
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment Variables**:
     ```
     PORT=10000
     MONGODB_URI=<your-mongodb-atlas-connection-string>
     JWT_SECRET=<generate-a-strong-random-secret-key>
     FRONTEND_URL=https://your-frontend-url.vercel.app
     ```
   - For JWT_SECRET, generate a random string:
     ```bash
     node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
     ```

4. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment (5-10 minutes)
   - Copy your backend URL (e.g., `https://slotswapper-backend.onrender.com`)

### Option B: Deploy via Railway

1. Go to https://railway.app → Sign up
2. Click "New Project" → "Deploy from GitHub"
3. Select your repository
4. Add environment variables:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `FRONTEND_URL`
5. Set root directory to `backend`
6. Railway will auto-detect and deploy

---

## Step 3: Deploy Frontend to Vercel

### Option A: Deploy via GitHub

1. **Update Frontend API URL**
   - Create `.env.production` in `frontend/` directory:
     ```
     VITE_API_URL=https://your-backend-url.onrender.com/api
     ```
   - Or update `frontend/src/services/api.js` to use environment variable

2. **Push to GitHub** (if not already done)
   ```bash
   git add .
   git commit -m "Add production config"
   git push
   ```

3. **Deploy to Vercel**
   - Go to https://vercel.com → Sign up/Login
   - Click "Add New" → "Project"
   - Import your GitHub repository
   - **Configure Project**:
     - **Framework Preset**: Vite
     - **Root Directory**: `frontend`
     - **Build Command**: `npm run build`
     - **Output Directory**: `dist`
     - **Install Command**: `npm install`
     - **Environment Variables**:
       ```
       VITE_API_URL=https://your-backend-url.onrender.com/api
       ```
   - Click "Deploy"
   - Wait for deployment (2-3 minutes)
   - Copy your frontend URL (e.g., `https://slotswapper.vercel.app`)

### Option B: Deploy via Netlify

1. Go to https://netlify.com → Sign up
2. Click "Add new site" → "Import an existing project"
3. Connect GitHub repository
4. Build settings:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist`
5. Add environment variable:
   - `VITE_API_URL=https://your-backend-url.onrender.com/api`
6. Click "Deploy site"

---

## Step 4: Update Backend CORS

After deploying frontend, update backend environment variable:

1. Go to Render Dashboard → Your Backend Service → Environment
2. Update `FRONTEND_URL` to your Vercel/Netlify URL
3. Redeploy the service

---

## Step 5: Update Frontend API URL

If you need to change the API URL after deployment:

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Update `VITE_API_URL`
3. Redeploy

---

## Alternative: Deploy Everything to One Platform

### Railway (Full Stack)

1. Deploy backend (as above)
2. For frontend:
   - Add new service → "Static Site"
   - Root directory: `frontend`
   - Build command: `npm run build`
   - Output directory: `frontend/dist`
   - Add environment variable: `VITE_API_URL`

### Render (Full Stack)

1. Deploy backend as Web Service
2. Deploy frontend as Static Site:
   - New → Static Site
   - Connect GitHub
   - Root directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `frontend/dist`

---

## Quick Deployment Checklist

- [ ] MongoDB Atlas cluster created
- [ ] Database user created with password
- [ ] IP whitelist configured
- [ ] Connection string saved
- [ ] Backend deployed to Render/Railway
- [ ] Backend environment variables set
- [ ] Backend URL saved
- [ ] Frontend deployed to Vercel/Netlify
- [ ] Frontend environment variables set
- [ ] Backend CORS updated with frontend URL
- [ ] Tested signup/login
- [ ] Tested creating events
- [ ] Tested swap functionality

---

## Environment Variables Summary

### Backend (.env)
```env
PORT=10000
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/slotswapper?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-at-least-32-characters-long
FRONTEND_URL=https://your-frontend-url.vercel.app
```

### Frontend (.env.production)
```env
VITE_API_URL=https://your-backend-url.onrender.com/api
```

---

## Troubleshooting

### Backend Issues

1. **Connection to MongoDB fails**
   - Check MongoDB Atlas IP whitelist
   - Verify connection string format
   - Ensure username/password are URL-encoded

2. **CORS errors**
   - Verify `FRONTEND_URL` in backend matches frontend domain
   - Check backend CORS configuration

3. **Build fails**
   - Check Node.js version (should be 18+)
   - Verify all dependencies in package.json

### Frontend Issues

1. **API calls fail**
   - Verify `VITE_API_URL` is correct
   - Check backend is running
   - Check browser console for CORS errors

2. **Build fails**
   - Check Node.js version
   - Verify all dependencies installed

---

## Cost Estimate

- **MongoDB Atlas**: Free tier (512MB storage)
- **Render**: Free tier (sleeps after 15 min inactivity)
- **Vercel**: Free tier (100GB bandwidth)
- **Total**: $0/month (for small apps)

---

## Production Best Practices

1. **Security**
   - Use strong JWT_SECRET (32+ characters, random)
   - Enable MongoDB Atlas IP restrictions
   - Use HTTPS (automatic with Vercel/Render)
   - Consider rate limiting

2. **Performance**
   - Enable MongoDB Atlas free tier monitoring
   - Use Render paid tier for always-on (or Railway)
   - Consider CDN for static assets

3. **Monitoring**
   - Set up error tracking (Sentry)
   - Monitor API response times
   - Set up uptime monitoring (UptimeRobot)

---

## Need Help?

- Check Render logs: Dashboard → Your Service → Logs
- Check Vercel logs: Dashboard → Your Project → Deployments → View Function Logs
- MongoDB Atlas: Check cluster status and connection issues

