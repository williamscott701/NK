#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the bible-books.json file
const bibleBooksPath = path.join(__dirname, 'src', 'data', 'bible-books.json');

// Expected canonical order (standard Bible order)
const expectedCanonicalOrder = [
    // Old Testament (39 books)
    'genesis', 'exodus', 'leviticus', 'numbers', 'deuteronomy',
    'joshua', 'judges', 'ruth', '1-samuel', '2-samuel',
    '1-kings', '2-kings', '1-chronicles', '2-chronicles', 'ezra',
    'nehemiah', 'esther', 'job', 'psalms', 'proverbs',
    'ecclesiastes', 'song-of-solomon', 'isaiah', 'jeremiah', 'lamentations',
    'ezekiel', 'daniel', 'hosea', 'joel', 'amos',
    'obadiah', 'jonah', 'micah', 'nahum', 'habakkuk',
    'zephaniah', 'haggai', 'zechariah', 'malachi',
    // New Testament (27 books)
    'matthew', 'mark', 'luke', 'john', 'acts',
    'romans', '1-corinthians', '2-corinthians', 'galatians', 'ephesians',
    'philippians', 'colossians', '1-thessalonians', '2-thessalonians', '1-timothy',
    '2-timothy', 'titus', 'philemon', 'hebrews', 'james',
    '1-peter', '2-peter', '1-john', '2-john', '3-john',
    'jude', 'revelation'
];

// Expected chronological order (approximate order of events)
const expectedChronologicalOrder = [
    // Old Testament (chronological)
    'genesis', 'exodus', 'leviticus', 'numbers', 'deuteronomy',
    'joshua', 'judges', 'ruth', '1-samuel', '2-samuel',
    '1-kings', '2-kings', '1-chronicles', '2-chronicles', 'ezra',
    'nehemiah', 'esther', 'job', 'psalms', 'proverbs',
    'ecclesiastes', 'song-of-solomon', 'isaiah', 'jeremiah', 'lamentations',
    'ezekiel', 'daniel', 'hosea', 'joel', 'amos',
    'obadiah', 'jonah', 'micah', 'nahum', 'habakkuk',
    'zephaniah', 'haggai', 'zechariah', 'malachi',
    // New Testament (chronological)
    'matthew', 'mark', 'luke', 'john', 'acts',
    'romans', '1-corinthians', '2-corinthians', 'galatians', 'ephesians',
    'philippians', 'colossians', '1-thessalonians', '2-thessalonians', '1-timothy',
    '2-timothy', 'titus', 'philemon', 'hebrews', 'james',
    '1-peter', '2-peter', '1-john', '2-john', '3-john',
    'jude', 'revelation'
];

function checkBookOrders() {
    try {
        // Read the bible-books.json file
        const bibleBooksData = JSON.parse(fs.readFileSync(bibleBooksPath, 'utf8'));
        const books = bibleBooksData.books;

        if (!books || !Array.isArray(books)) {
            console.error('❌ Error: Invalid bible-books.json structure');
            return;
        }

        console.log(`📚 Checking ${books.length} books for order fields...\n`);

        let missingCanonicalOrder = 0;
        let missingChronologicalOrder = 0;
        let canonicalOrderMismatch = 0;
        let chronologicalOrderMismatch = 0;
        let booksWithMissingFields = [];

        // Check each book
        books.forEach((book, index) => {
            const bookId = book.id;
            const bookName = book.name;
            
            // Check if canonicalOrder exists
            if (typeof book.canonicalOrder === 'undefined') {
                missingCanonicalOrder++;
                booksWithMissingFields.push(`${bookName} (${bookId}) - missing canonicalOrder`);
            } else if (book.canonicalOrder !== index + 1) {
                canonicalOrderMismatch++;
                console.log(`⚠️  Warning: ${bookName} has canonicalOrder ${book.canonicalOrder}, expected ${index + 1}`);
            }

            // Check if chronologicalOrder exists
            if (typeof book.chronologicalOrder === 'undefined') {
                missingChronologicalOrder++;
                booksWithMissingFields.push(`${bookName} (${bookId}) - missing chronologicalOrder`);
            } else if (book.chronologicalOrder !== index + 1) {
                chronologicalOrderMismatch++;
                console.log(`⚠️  Warning: ${bookName} has chronologicalOrder ${book.chronologicalOrder}, expected ${index + 1}`);
            }
        });

        // Summary
        console.log('\n📊 SUMMARY:');
        console.log(`Total books: ${books.length}`);
        console.log(`Books with canonicalOrder: ${books.length - missingCanonicalOrder}/${books.length}`);
        console.log(`Books with chronologicalOrder: ${books.length - missingChronologicalOrder}/${books.length}`);
        
        if (missingCanonicalOrder > 0) {
            console.log(`\n❌ Missing canonicalOrder fields: ${missingCanonicalOrder}`);
            booksWithMissingFields.filter(field => field.includes('canonicalOrder')).forEach(field => {
                console.log(`   - ${field}`);
            });
        }

        if (missingChronologicalOrder > 0) {
            console.log(`\n❌ Missing chronologicalOrder fields: ${missingChronologicalOrder}`);
            booksWithMissingFields.filter(field => field.includes('chronologicalOrder')).forEach(field => {
                console.log(`   - ${field}`);
            });
        }

        if (canonicalOrderMismatch > 0) {
            console.log(`\n⚠️  Canonical order mismatches: ${canonicalOrderMismatch}`);
        }

        if (chronologicalOrderMismatch > 0) {
            console.log(`\n⚠️  Chronological order mismatches: ${chronologicalOrderMismatch}`);
        }

        if (missingCanonicalOrder === 0 && missingChronologicalOrder === 0) {
            console.log('\n✅ All books have both canonicalOrder and chronologicalOrder fields!');
            
            // Verify the order values
            console.log('\n🔍 Verifying order values...');
            let orderCorrect = true;
            
            books.forEach((book, index) => {
                if (book.canonicalOrder !== index + 1) {
                    console.log(`❌ ${book.name}: canonicalOrder ${book.canonicalOrder}, expected ${index + 1}`);
                    orderCorrect = false;
                }
                if (book.chronologicalOrder !== index + 1) {
                    console.log(`❌ ${book.name}: chronologicalOrder ${book.chronologicalOrder}, expected ${index + 1}`);
                    orderCorrect = false;
                }
            });

            if (orderCorrect) {
                console.log('✅ All order values are correct!');
            } else {
                console.log('❌ Some order values are incorrect!');
            }
        } else {
            console.log('\n❌ Some books are missing required order fields.');
        }

        // Check if the file structure matches expected book IDs
        console.log('\n🔍 Checking book ID consistency...');
        const actualBookIds = books.map(book => book.id);
        const expectedBookIds = expectedCanonicalOrder;
        
        if (actualBookIds.length !== expectedBookIds.length) {
            console.log(`⚠️  Book count mismatch: ${actualBookIds.length} vs expected ${expectedBookIds.length}`);
        }

        const missingBookIds = expectedBookIds.filter(id => !actualBookIds.includes(id));
        const extraBookIds = actualBookIds.filter(id => !expectedBookIds.includes(id));

        if (missingBookIds.length > 0) {
            console.log(`❌ Missing expected book IDs: ${missingBookIds.join(', ')}`);
        }

        if (extraBookIds.length > 0) {
            console.log(`⚠️  Extra book IDs found: ${extraBookIds.join(', ')}`);
        }

        if (missingBookIds.length === 0 && extraBookIds.length === 0) {
            console.log('✅ Book ID consistency check passed!');
        }

    } catch (error) {
        console.error('❌ Error reading or parsing bible-books.json:', error.message);
    }
}

// Run the check
checkBookOrders();
