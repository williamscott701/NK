# NK - Bible Study Project

A comprehensive Bible study application built with Astro, featuring Bible concepts, stories, and chronological ordering tools.

## Project Structure

### 📁 Scripts
All JavaScript utilities and analysis tools are organized in the `scripts/` directory:

#### `scripts/bible-order/` - Bible Ordering Scripts
Scripts for managing and fixing Bible book and chapter ordering:
- `show_chronological_order.js` - Display chronological order of Bible books
- `show_canonical_order.js` - Display canonical order of Bible books
- `final_chronological_fix.js` - Final fixes for chronological ordering
- `fix_duplicate_chronological.js` - Remove duplicate chronological entries
- `update_chronological_order.js` - Update chronological order data
- `fix_chronological_order.js` - Fix chronological order issues
- `verify_and_fix_book_orders.js` - Verify and fix book order problems
- `check_book_orders.js` - Check book ordering consistency
- `check_book_chapters.js` - Verify chapter counts for books
- `remove_duplicate_chapters.js` - Remove duplicate chapter entries
- `check_remaining.js` - Check remaining tasks and issues

#### `scripts/analysis/` - Analysis Scripts
Scripts for analyzing Bible data and order:
- `chronological_order_analysis.js` - Analyze chronological ordering
- `detailed_order_check.js` - Detailed checking of book orders

#### `scripts/utilities/` - Utility Scripts
General utility scripts:
- `start-dev.sh` - Development server startup script

### 📁 Documentation
Markdown documentation files:
- `docs/BIBLE_ORDER_STATUS.md` - Current status of Bible ordering
- `docs/BIBLE_COMPLETION_TASKS.md` - Tasks for completing Bible setup

### 🚀 Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   ./scripts/utilities/start-dev.sh
   ```

3. **Run Bible ordering scripts:**
   ```bash
   # Show current chronological order
   node scripts/bible-order/show_chronological_order.js
   
   # Fix ordering issues
   node scripts/bible-order/fix_chronological_order.js
   ```

## Features

- **Bible Concepts**: Explore theological concepts with detailed explanations
- **Bible Stories**: Interactive storytelling with chronological context
- **Book Navigation**: Browse all 66 books with chapter-by-chapter access
- **Search Functionality**: Find concepts, stories, and passages quickly
- **Responsive Design**: Modern UI built with Tailwind CSS

## Technology Stack

- **Framework**: Astro
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Build Tool**: Vite

## Development

The project uses Astro for static site generation with TypeScript support. All Bible-related scripts are organized in the `scripts/` directory for easy maintenance and execution.

## License

[Add your license information here]
