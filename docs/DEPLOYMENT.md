# Deployment Guide

This project uses **local build + main branch deployment** for GitHub Pages.

## How It Works

1. **Local Build**: Build the project on your local machine
2. **Main Branch Deployment**: Deploy the built `dist/` folder to the `main` branch
3. **Simple & Fast**: No complex CI/CD, just direct deployment

## Deployment Process

The deployment workflow:
1. Builds the project locally with `npm run build`
2. Updates the `dist/` folder in the `main` branch
3. Pushes the built `dist/` folder to GitHub
4. GitHub Pages automatically serves from the `main` branch

## Manual Deployment

To deploy manually:

```bash
npm run build
git add dist/
git commit -m "Update site"
git push origin main
```

This process:
- Builds the project (`npm run build`)
- Adds the built files to git
- Commits and pushes to GitHub

## GitHub Pages Configuration

- **Source**: Deploy from a branch
- **Branch**: `main` (contains both source code and built site)
- **URL**: https://williamscott701.github.io/NK

## Troubleshooting

If deployment fails:
1. Check the build output for errors
2. Ensure all TypeScript errors are fixed
3. Verify the build works locally with `npm run build`
4. Check that the `dist/` folder is committed to the `main` branch

## Local Development

For local development, use:
```bash
npm run dev
```

The site will be available at http://localhost:8080
