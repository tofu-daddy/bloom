# How to Publish Bloom to GitHub Pages 🚀

Follow these steps to get your digital garden online.

## 1. Create a GitHub Repository
1. Go to [github.com/new](https://github.com/new).
2. Name your repository (e.g., `bloom`).
3. Keep it **Public** (required for free GitHub Pages).
4. Do **not** initialize with a README, license, or gitignore (we already have them).
5. Click **Create repository**.

## 2. Initialize and Push Your Code
Open your terminal in the `bloom` folder and run:

```bash
# Initialize git
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial commit: Digital Flower Garden"

# Rename branch to main
git branch -M main

# Link to your GitHub repo (Replace <YOUR_USERNAME> and <REPO_NAME>)
git remote add origin https://github.com/<YOUR_USERNAME>/<REPO_NAME>.git

# Push to GitHub
git push -u origin main
```

## 3. Configure for Deployment
1. Open `vite.config.js`.
2. Change `base: './'` to `base: '/<REPO_NAME>/'`.
   *Example: If your repo is `bloom`, it should be `base: '/bloom/'`.*

## 4. Deploy!
Run this command in your terminal:

```bash
npm install
npm run deploy
```

This will build your project and push it to a special branch called `gh-pages`.

## 5. Enable GitHub Pages
1. Go to your repo on GitHub.
2. Click **Settings** > **Pages** (on the left sidebar).
3. Under **Build and deployment** > **Source**, ensure it says "Deploy from a branch".
4. Under **Branch**, select `gh-pages` and folder `/ (root)`.
5. Click **Save**.

Wait a minute, and your site will be live at `https://<YOUR_USERNAME>.github.io/<REPO_NAME>/`! ✿
