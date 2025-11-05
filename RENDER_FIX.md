# Fix for Render Deployment Error

If you're getting the error: `failed to read dockerfile: open Dockerfile: no such file or directory`

## Solution: Configure Render to Use Node.js (Not Docker)

Render is detecting the Dockerfile in the `backend/` folder and trying to use Docker. We need to explicitly tell it to use Node.js instead.

### Option 1: Manual Configuration in Render Dashboard (Recommended)

1. Go to your Render dashboard
2. Click on your service (or create a new one)
3. In the service settings, make sure:
   - **Environment**: `Node`
   - **Root Directory**: `backend` (IMPORTANT!)
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Docker**: Make sure Docker is NOT selected/enabled

4. Save and redeploy

### Option 2: Use Render Blueprint (render.yaml)

If using the render.yaml file:
1. Make sure you're using "New Blueprint" when creating the service
2. Select the `render.yaml` file
3. Render should automatically configure it correctly

### Option 3: Remove Dockerfile Detection

If the issue persists, you can temporarily rename the Dockerfiles:
- Rename `backend/Dockerfile` to `backend/Dockerfile.local` (for local Docker use)
- This will prevent Render from detecting it

### Quick Fix Steps:

1. **In Render Dashboard:**
   - Go to your service → Settings
   - Scroll to "Build & Deploy"
   - Make sure:
     - Root Directory: `backend`
     - Environment: `Node` (not Docker)
   - Save

2. **Add Environment Variables:**
   - `MONGODB_URI` - Your MongoDB Atlas connection string
   - `JWT_SECRET` - A random secret key (32+ characters)
   - `PORT` - `10000` (or leave blank, Render sets this automatically)
   - `FRONTEND_URL` - Your frontend URL (set after deploying frontend)

3. **Redeploy**

The key issue is that Render needs to know:
- **Root Directory**: `backend` (so it looks for package.json in the right place)
- **Environment**: `Node` (not Docker)

This should fix the deployment error!

