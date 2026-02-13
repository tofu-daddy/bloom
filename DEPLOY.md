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

# Link to your GitHub repo
git remote add origin https://github.com/tofu-daddy/bloom.git

# Push to GitHub
git push -u origin main
```

## 3. Configure for Deployment
1. Open `vite.config.js`.
2. Ensure it says `base: '/bloom/'`.

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

## 6. Database Setup (Supabase)
To make the garden shared across all devices, you must create the table in Supabase:
1. In your Supabase Dashboard, click **SQL Editor** (left sidebar).
2. Click **New Query**.
3. Paste the following SQL and click **Run**:

```sql
create table flowers (
  id text primary key,
  dataUrl text not null,
  x float not null,
  y float not null,
  size float not null,
  date timestamp with time zone default now()
);

-- Enable Row Level Security (RLS)
alter table flowers enable row level security;

-- Create policy to allow everyone to read/write
create policy "Public read" on flowers for select to public using (true);
create policy "Public insert" on flowers for insert to public with check (true);
```

4. Your garden is now live at [https://tofu-daddy.github.io/bloom/](https://tofu-daddy.github.io/bloom/)! ✿
