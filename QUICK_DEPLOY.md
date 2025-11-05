# Quick Deployment Guide (5 Minutes)

## Simplest Path: Render + Vercel + MongoDB Atlas

### 1. MongoDB Atlas (2 minutes)
1. Go to https://www.mongodb.com/cloud/atlas → Sign up
2. Create free cluster (M0)
3. Create database user (save password!)
4. Network Access → Allow access from anywhere (0.0.0.0/0)
5. Get connection string from "Connect" → "Connect your application"
6. Replace `<username>` and `<password>` in connection string

### 2. Backend - Render (2 minutes)
1. Push code to GitHub
2. Go to https://render.com → Sign up
3. New → Web Service → Connect GitHub
4. **IMPORTANT Settings:**
   - **Environment**: `Node` (NOT Docker!)
   - **Root Directory**: `backend` ⚠️ CRITICAL!
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - Make sure Docker is **NOT** selected/enabled
5. Environment Variables:
   ```
   MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/slotswapper?retryWrites=true&w=majority
   JWT_SECRET=<generate-random-32-char-string>
   PORT=10000
   ```
6. Deploy → Copy backend URL (e.g., `https://slotswapper-backend.onrender.com`)

### 3. Frontend - Vercel (1 minute)
1. Go to https://vercel.com → Sign up
2. New Project → Import GitHub repo
3. Settings:
   - **Root Directory**: `frontend`
   - **Framework**: Vite
4. Environment Variable:
   ```
   VITE_API_URL=https://your-backend-url.onrender.com/api
   ```
5. Deploy → Copy frontend URL

### 4. Update Backend CORS
1. Go back to Render dashboard
2. Update environment variable:
   ```
   FRONTEND_URL=https://your-frontend-url.vercel.app
   ```
3. Redeploy

### 5. Test
- Visit your frontend URL
- Sign up
- Create an event
- Test swap functionality

---

## Generate JWT Secret

Run this in terminal:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Or use online tool: https://randomkeygen.com

---

## Cost: FREE 🎉

All services offer free tiers:
- MongoDB Atlas: 512MB free
- Render: Free tier (sleeps after 15 min)
- Vercel: Free tier (100GB bandwidth/month)

---

## Troubleshooting

**Backend not connecting to MongoDB?**
- Check MongoDB IP whitelist (should include 0.0.0.0/0)
- Verify connection string format
- Check username/password are correct

**CORS errors?**
- Make sure `FRONTEND_URL` in backend matches your Vercel URL exactly
- Check backend logs in Render dashboard

**Frontend can't reach backend?**
- Verify `VITE_API_URL` in Vercel environment variables
- Check backend is running (Render dashboard)
- Check browser console for errors

---

For detailed instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)

