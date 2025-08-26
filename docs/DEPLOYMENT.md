# Deployment Guide

This project is automatically deployed to GitHub Pages using GitHub Actions.

## How It Works

1. **Automatic Deployment**: Every time code is pushed to the `main` branch, GitHub Actions automatically builds and deploys the site.

2. **Manual Deployment**: You can also trigger deployment manually from the GitHub Actions tab.

## Deployment Process

The deployment workflow:
1. Checks out the code
2. Sets up Node.js 18
3. Installs dependencies with `npm ci`
4. Builds the project with `npm run build`
5. Deploys the `dist/` folder to GitHub Pages

## Manual Deployment

To deploy manually:

```bash
npm run deploy
```

This command:
- Builds the project (`npm run build`)
- Deploys to GitHub Pages using gh-pages

## GitHub Pages Configuration

- **Source**: GitHub Actions (recommended)
- **Branch**: `gh-pages` (auto-created by gh-pages package)
- **URL**: https://williamscott701.github.io/NK

## Troubleshooting

If deployment fails:
1. Check the GitHub Actions logs
2. Ensure all TypeScript errors are fixed
3. Verify the build works locally with `npm run build`

## Local Development

For local development, use:
```bash
npm run dev
```

The site will be available at http://localhost:8080
