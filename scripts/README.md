# Scripts

This directory contains various utility scripts for the Bible web application.

## Bible Order Scripts

Scripts for managing and fixing Bible book orders and chronological arrangements.

### `check-pending-concepts.js`

**Purpose**: Analyzes which Bible concepts are still pending content creation by comparing the JSON definitions with the markdown content file.

**Usage**:
```bash
# Quick check in terminal
npm run check-concepts

# Generate detailed report
npm run concepts-report

# Direct usage with custom output file
node scripts/check-pending-concepts.js [output-file]
```

**Features**:
- Shows completion status and statistics
- Lists all pending concepts with their metadata
- Groups concepts by category and significance
- Prioritizes concepts by theological importance
- Generates detailed markdown reports
- Provides actionable next steps

**Output**:
- Terminal display with emojis and formatting
- Optional markdown report file for documentation
- Categorized breakdown of pending work
- Completion percentage and progress tracking

**Example Output**:
```
🔍 Checking pending Bible concepts...

📊 Total concepts defined: 20
✅ Concepts with content: 2
⏳ Concepts pending: 18

📈 COMPLETION STATUS: 10.0% (2/20)

💡 NEXT STEPS:
   Consider working on concepts with "High" significance first
   Focus on one category at a time for consistency
   Use the existing content as a template for new concepts
```

**Use Cases**:
- Project planning and prioritization
- Progress tracking and reporting
- Identifying high-priority concepts to work on
- Maintaining consistency across concept categories
- Documentation for team collaboration

## Security Scripts

### `validate-csp.js`

Validates Content Security Policy configuration files.

**Usage**:
```bash
npm run validate-csp
```

## Development Scripts

### `start-dev.sh`

Robust development server startup script with port management.

**Usage**:
```bash
./scripts/utilities/start-dev.sh
```

## Analysis Scripts

Scripts for analyzing Bible content and structure.

### `chronological_order_analysis.js`

Analyzes the chronological order of Bible content.

### `detailed_order_check.js`

Performs detailed checks on Bible content ordering.

## Bible Order Management

Scripts for managing Bible book orders and chapter arrangements.

### `check_book_chapters.js`

Checks Bible book chapters for completeness and accuracy.

### `check_book_orders.js`

Verifies Bible book ordering against canonical standards.

### `check_remaining.js`

Identifies remaining work in Bible order management.

### `fix_chronological_order.js`

Fixes chronological ordering issues in Bible content.

### `fix_duplicate_chronological.js`

Removes duplicate chronological entries.

### `remove_duplicate_chapters.js`

Eliminates duplicate chapter entries.

### `show_canonical_order.js`

Displays the canonical order of Bible books.

### `show_chronological_order.js`

Shows the chronological order of Bible content.

### `update_chronological_order.js`

Updates chronological ordering information.

### `verify_and_fix_book_orders.js`

Comprehensive verification and fixing of Bible book orders.

## Content Conversion

### `convert-concepts-to-markdown.js`

Converts Bible concepts from JSON to markdown format.

## Running Scripts

Most scripts can be run directly with Node.js:

```bash
node scripts/script-name.js
```

Some scripts have npm shortcuts defined in `package.json`:

```bash
npm run script-name
```

## Script Dependencies

Scripts use ES modules syntax (import/export) as the project is configured with `"type": "module"` in package.json.

## Error Handling

Scripts include comprehensive error handling and will exit gracefully with informative error messages if files cannot be read or processed.
