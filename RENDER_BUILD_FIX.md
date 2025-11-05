# Fix for Render Build Error

## Problem
Render is using `yarn` instead of `npm` and can't find package.json in the expected path.

## Solution: Manual Configuration in Render Dashboard

Go to your Render service settings and update these fields:

### Build & Deploy Settings

1. **Root Directory**: `backend` ✅ (You already have this)

2. **Build Command**: 
   ```
   npm install
   ```
   (NOT `yarn install` or `cd backend && npm install`)

3. **Start Command**:
   ```
   npm start
   ```
   (NOT `yarn start`)

### Why This Happens

Render auto-detects package manager:
- If `yarn.lock` exists → uses yarn
- If `package-lock.json` exists → uses npm
- If both exist → prefers yarn

Since we're using npm, make sure:
- `package-lock.json` exists in `backend/` folder
- No `yarn.lock` file exists

### Quick Fix Steps

1. In Render Dashboard → Your Service → Settings
2. Scroll to "Build & Deploy" section
3. Update:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. Make sure Root Directory is set to `backend`
5. Save and redeploy

### Alternative: Force npm with environment variable

Add this environment variable in Render:
```
NAME: npm_config_use_npm
VALUE: true
```

Or add to your service:
```
NPM_CONFIG_USE_NPM=true
```

### Verify package-lock.json exists

Make sure `backend/package-lock.json` exists in your repository. If not:
```bash
cd backend
npm install
git add package-lock.json
git commit -m "Add package-lock.json"
git push
```

