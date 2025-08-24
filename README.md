

## Bible Book Structure

The `bible-books.json` file contains comprehensive information about each book of the Bible, including:

### Book Properties
- **id**: Unique identifier for the book (e.g., "genesis", "exodus")
- **name**: Full name of the book (e.g., "Genesis", "Exodus")
- **testament**: "Old Testament" or "New Testament"
- **chapters**: Total number of chapters in the book
- **description**: Brief description of the book's content and purpose
- **author**: Traditional author of the book
- **themes**: Array of key themes and topics covered in the book
- **canonicalOrder**: Position in the standard Bible order (1-66)
- **chronologicalOrder**: Position in chronological order of events (1-66)
- **chaptersContent**: Detailed information for each chapter

### Chapter Properties
- **number**: Chapter number
- **title**: Descriptive title of the chapter
- **summary**: Brief summary of the chapter's content
- **keyVerses**: Important verses from the chapter
- **content**: Sample content or key passage
- **themes**: Themes present in the chapter

### Order Information

#### Canonical Order (1-66)
The traditional order of books as they appear in most Bibles:
- **Old Testament (Books 1-39)**: Genesis through Malachi
- **New Testament (Books 40-66)**: Matthew through Revelation

This order follows the standard Protestant Bible arrangement and is used for:
- Traditional Bible study and reference
- Cross-referencing between translations
- Standard chapter and verse citations
- Bible reading plans and devotionals

#### Chronological Order (1-66)
The approximate order based on when events occurred historically:
- **Books 1-5**: Pentateuch (Genesis-Deuteronomy) - Creation to ~1406 BC
- **Books 6-17**: Historical books (Joshua-Esther) - ~1406 BC to ~400 BC
- **Books 18-39**: Wisdom and Prophetic books (Job-Malachi) - Various periods
- **Books 40-66**: New Testament (Matthew-Revelation) - ~4 BC to ~95 AD

This order is useful for:
- Understanding the historical timeline of biblical events
- Studying the development of God's plan through time
- Contextualizing prophecies and their fulfillments
- Historical Bible studies and chronological reading plans

### Data Integrity
All 66 books in the database include:
- ✅ Complete canonical order numbering (1-66)
- ✅ Complete chronological order numbering (1-66)
- ✅ Consistent book ID structure
- ✅ Comprehensive chapter content for each book
- ✅ Detailed thematic information

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
│   │   ├── Breadcrumb.tsx
│   │   ├── PageSearch.tsx
│   │   └── SearchBar.tsx
│   ├── data/
│   │   ├── bible-books.json      # Complete Bible book data
│   │   ├── bible-concepts.json   # Biblical concepts and themes
│   │   └── bible-stories.json    # Bible stories and narratives
│   ├── layouts/
│   │   └── Layout.astro
│   └── pages/
│       ├── book/                 # Individual book pages
│       ├── concept/              # Concept pages
│       ├── stories/              # Story pages
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

## Data Validation

The project includes validation scripts to ensure data integrity:

- **`check_book_orders.js`**: Verifies that all books have proper canonical and chronological order fields
- **`check_book_chapters.js`**: Validates chapter completeness across all books
- **`check_remaining.js`**: Identifies any missing or incomplete data

Run these scripts to validate the Bible data:
```bash
node check_book_orders.js
node check_book_chapters.js
node check_remaining.js
```

## Customization

- **Colors**: Modify the custom colors in `tailwind.config.mjs`
- **Content**: Update Bible data in the JSON files under `src/data/`
- **Search**: Enhance search functionality in the search components
- **Navigation**: Customize breadcrumb and navigation components

## License

MIT
