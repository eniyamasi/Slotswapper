# Fix for Render "package.json not found" Error

## Problem
Render is looking for package.json at `/opt/render/project/src/backend/package.json` but can't find it.

## Solution

### Option 1: Verify Root Directory (Most Common Fix)

In Render Dashboard → Your Service → Settings:

1. **Root Directory** field should be EXACTLY:
   ```
   backend
   ```
   - No leading slash: ❌ `/backend` 
   - No trailing slash: ❌ `backend/`
   - Just: ✅ `backend`

2. **Build Command** should be:
   ```
   npm install
   ```

3. **Start Command** should be:
   ```
   npm start
   ```

### Option 2: Clear Root Directory and Use Full Paths

If Root Directory isn't working, try this:

1. **Root Directory**: Leave EMPTY or blank
2. **Build Command**:
   ```
   cd backend && npm install
   ```
3. **Start Command**:
   ```
   cd backend && npm start
   ```

### Option 3: Verify Repository Structure on GitHub

Check your GitHub repo structure:
- Go to https://github.com/eniyamasi/Slotswapper
- Make sure `backend/package.json` exists in the repo
- Make sure you're deploying from the `main` branch

### Option 4: Use Render Blueprint (render.yaml)

Instead of manual configuration, use the render.yaml file:

1. In Render Dashboard → New → Blueprint
2. Connect your GitHub repo
3. Render will read `render.yaml` automatically
4. This ensures correct configuration

### Quick Checklist

- [ ] Root Directory is set to `backend` (exactly, no slashes)
- [ ] Build Command is `npm install` (or `cd backend && npm install` if root dir is empty)
- [ ] Start Command is `npm start` (or `cd backend && npm start` if root dir is empty)
- [ ] Branch is `main`
- [ ] Environment is `Node` (not Docker)
- [ ] `backend/package.json` exists in GitHub repo

### If Still Not Working

1. **Delete the service** and recreate it
2. Make sure to set Root Directory FIRST before setting build commands
3. Or use the render.yaml blueprint approach

### Verify on GitHub

Go to: https://github.com/eniyamasi/Slotswapper/tree/main/backend

You should see `package.json` file there. If not, the file isn't pushed to GitHub.

