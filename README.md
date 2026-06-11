# TradeAid Preview

A modernized React/Vite app with editorial design featuring the TradeAid trading education experience.

## Local Development

```bash
npm install
npm run dev
```

The app runs at `http://localhost:5173`.

## Build

```bash
npm run build
```

Output files go to the `dist/` folder, ready for deployment.

## Deployment to Vercel

### Step 1: Create GitHub Repository

1. Go to [github.com/new](https://github.com/new)
2. Repository name: `tradeaid-preview`
3. Choose Public or Private
4. Do **NOT** initialize with README (we have one)
5. Click "Create repository"

### Step 2: Push Code to GitHub

In your terminal, from the `tradeaid-preview` folder:

```bash
git init
git add .
git commit -m "Initial commit: TradeAid redesigned with editorial theme"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/tradeaid-preview.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username.

### Step 3: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign up/log in
2. Click "New Project"
3. Select "Import Git Repository"
4. Paste your GitHub repo URL: `https://github.com/YOUR_USERNAME/tradeaid-preview.git`
5. Vercel auto-detects Vite settings
6. Click "Deploy"

Your app will be live at a URL like `https://tradeaid-preview.vercel.app`

## Theme

The app uses an editorial design system with:
- **Colors**: Gold (#B8860B), Burgundy (#8B3A3A), Ink (#1A1A1A)
- **Typography**: DM Sans (sans-serif), Cormorant Garamond (serif)
- **Component Library**: Vite + React 18

## Structure

- `src/App.jsx` - Homepage shell
- `src/TradeAidLegacy.jsx` - Full trading experience
- `src/data.js` - Theme tokens and content
- `src/styles.css` - Global editorial styles
