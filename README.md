# Bloom ✿

A digital flower garden where users can hand-draw and plant flowers.

## Features

- **Hand-drawn Art**: Draw your own flower with a simple, elegant canvas tool.
- **Persistence**: Flowers are saved to local storage, so your garden grows over time.
- **Modern UI**: Built with React, Vite, and a premium "Cotton Cloud" aesthetic.
- **Typography**: Uses the elegant "Instrument Serif" for headlines.

## Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run Locally**:
   ```bash
   npm run dev
   ```

3. **Build for Production**:
   ```bash
   npm run build
   ```

## Deploying to GitHub Pages

1. Initialize a new GitHub repository and push your code.
2. If your project is not at the root domain (e.g., `https://yourname.github.io/bloom/`), update `vite.config.js`:
   ```javascript
   export default defineConfig({
     plugins: [react()],
     base: '/bloom/', // Replace with your repo name
   })
   ```
3. Use a tool like `gh-pages` or set up a GitHub Action to deploy the `dist` folder.
