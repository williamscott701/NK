# Bible Learning Web App

A modern, interactive Bible learning platform built with Astro SSG, React, Tailwind CSS, and MDX.

## Features

- **Modern Design**: Clean, classy interface with beautiful gradients and animations
- **Interactive Search**: Large, prominent search area for Bible verses and concepts
- **React Islands**: Fast, interactive components where needed
- **SSG Performance**: Static site generation for optimal loading speeds
- **Responsive Design**: Works beautifully on all devices

## Tech Stack

- **Astro**: Static Site Generator with islands architecture
- **React**: For interactive components
- **Tailwind CSS**: Utility-first CSS framework
- **TypeScript**: Type-safe development
- **MDX**: Markdown with React components

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:4321](http://localhost:4321) in your browser

## Project Structure

```
/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   └── SearchBar.tsx
│   ├── data/
│   │   └── bible-concepts.json
│   ├── layouts/
│   │   └── Layout.astro
│   └── pages/
│       └── index.astro
├── astro.config.mjs
├── package.json
├── tailwind.config.mjs
└── tsconfig.json
```

## Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

## Customization

- **Colors**: Modify the custom colors in `tailwind.config.mjs`
- **Content**: Update Bible data in `src/data/bible-concepts.json`
- **Search**: Enhance search functionality in `SearchBar.tsx`

## License

MIT
