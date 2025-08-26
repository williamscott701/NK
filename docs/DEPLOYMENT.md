# Deployment Guide

This project uses **local build + docs folder deployment** for GitHub Pages.

## How It Works

1. **Local Build**: Build the project on your local machine
2. **Docs Folder Deployment**: Copy built files to the `docs/` folder in the `main` branch
3. **Simple & Fast**: No complex CI/CD, just direct deployment

## Deployment Process

The deployment workflow:
1. Builds the project locally with `npm run build`
2. Copies built files from `dist/` to the `docs/` folder
3. Pushes the `docs/` folder to GitHub
4. GitHub Pages automatically serves from the `docs/` folder

## Manual Deployment

To deploy manually:

```bash
npm run build
cp -r dist/* docs/
git add docs/
git commit -m "Update site"
git push origin main
```

This process:
- Builds the project (`npm run build`)
- Copies built files to the `docs/` folder
- Adds the `docs/` folder to git
- Commits and pushes to GitHub

## GitHub Pages Configuration

- **Source**: Deploy from a branch
- **Branch**: `main` (contains both source code and built site)
- **Folder**: `/docs` (serves the built site)
- **URL**: https://williamscott701.github.io/NK

## Troubleshooting

If deployment fails:
1. Check the build output for errors
2. Ensure all TypeScript errors are fixed
3. Verify the build works locally with `npm run build`
4. Check that the `docs/` folder contains the built files
5. Ensure the `docs/` folder is committed to the `main` branch

## Local Development

For local development, use:
```bash
npm run dev
```

The site will be available at http://localhost:8080
