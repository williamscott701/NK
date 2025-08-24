#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the bible-books.json file
const bibleBooksPath = path.join(__dirname, 'src', 'data', 'bible-books.json');

// Correct canonical order (standard Bible order)
const correctCanonicalOrder = [
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

// Correct chronological order (approximate order of events)
const correctChronologicalOrder = [
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

function verifyAndFixBookOrders() {
    try {
        console.log('🔍 Verifying and fixing book orders...\n');
        
        // Read the bible-books.json file
        const bibleBooksData = JSON.parse(fs.readFileSync(bibleBooksPath, 'utf8'));
        const books = bibleBooksData.books;

        if (!books || !Array.isArray(books)) {
            console.error('❌ Error: Invalid bible-books.json structure');
            return;
        }

        console.log(`📚 Found ${books.length} books in the file\n`);

        // Create a map of book ID to book object for easy lookup
        const bookMap = new Map();
        books.forEach(book => bookMap.set(book.id, book));

        // Check if all expected books are present
        const missingBooks = correctCanonicalOrder.filter(id => !bookMap.has(id));
        if (missingBooks.length > 0) {
            console.log(`❌ Missing books: ${missingBooks.join(', ')}`);
        }

        // Verify and fix canonical order
        console.log('📖 Verifying canonical order...');
        let canonicalIssues = 0;
        let canonicalFixed = 0;

        correctCanonicalOrder.forEach((bookId, index) => {
            const book = bookMap.get(bookId);
            if (book) {
                const expectedOrder = index + 1;
                if (book.canonicalOrder !== expectedOrder) {
                    console.log(`⚠️  ${book.name}: canonicalOrder ${book.canonicalOrder}, should be ${expectedOrder}`);
                    canonicalIssues++;
                    
                    // Fix the canonical order
                    book.canonicalOrder = expectedOrder;
                    canonicalFixed++;
                }
            }
        });

        // Verify and fix chronological order
        console.log('\n⏰ Verifying chronological order...');
        let chronologicalIssues = 0;
        let chronologicalFixed = 0;

        correctChronologicalOrder.forEach((bookId, index) => {
            const book = bookMap.get(bookId);
            if (book) {
                const expectedOrder = index + 1;
                if (book.chronologicalOrder !== expectedOrder) {
                    console.log(`⚠️  ${book.name}: chronologicalOrder ${book.chronologicalOrder}, should be ${expectedOrder}`);
                    chronologicalIssues++;
                    
                    // Fix the chronological order
                    book.chronologicalOrder = expectedOrder;
                    chronologicalFixed++;
                }
            }
        });

        // Summary of issues found
        console.log('\n📊 SUMMARY:');
        console.log(`Total books: ${books.length}`);
        console.log(`Canonical order issues: ${canonicalIssues}`);
        console.log(`Chronological order issues: ${chronologicalIssues}`);
        console.log(`Canonical order fixes: ${canonicalFixed}`);
        console.log(`Chronological order fixes: ${chronologicalFixed}`);

        if (canonicalIssues === 0 && chronologicalIssues === 0) {
            console.log('\n✅ All book orders are correct! No fixes needed.');
            return;
        }

        // Verify the fixes
        if (canonicalFixed > 0 || chronologicalFixed > 0) {
            console.log('\n🔧 Verifying fixes...');
            
            let allCorrect = true;
            correctCanonicalOrder.forEach((bookId, index) => {
                const book = bookMap.get(bookId);
                if (book && book.canonicalOrder !== index + 1) {
                    console.log(`❌ ${book.name}: canonicalOrder still incorrect: ${book.canonicalOrder}, should be ${index + 1}`);
                    allCorrect = false;
                }
            });

            correctChronologicalOrder.forEach((bookId, index) => {
                const book = bookMap.get(bookId);
                if (book && book.chronologicalOrder !== index + 1) {
                    console.log(`❌ ${book.name}: chronologicalOrder still incorrect: ${book.chronologicalOrder}, should be ${index + 1}`);
                    allCorrect = false;
                }
            });

            if (allCorrect) {
                console.log('✅ All fixes verified successfully!');
                
                // Save the corrected data back to the file
                console.log('\n💾 Saving corrected data to bible-books.json...');
                fs.writeFileSync(bibleBooksPath, JSON.stringify(bibleBooksData, null, 2));
                console.log('✅ File updated successfully!');
                
                // Final verification
                console.log('\n🔍 Final verification...');
                verifyFinalOrder();
            } else {
                console.log('❌ Some fixes could not be verified. Please check manually.');
            }
        }

    } catch (error) {
        console.error('❌ Error processing bible-books.json:', error.message);
    }
}

function verifyFinalOrder() {
    try {
        // Re-read the file to verify the changes were saved
        const bibleBooksData = JSON.parse(fs.readFileSync(bibleBooksPath, 'utf8'));
        const books = bibleBooksData.books;

        console.log(`\n📚 Final verification of ${books.length} books...`);

        let canonicalCorrect = 0;
        let chronologicalCorrect = 0;

        correctCanonicalOrder.forEach((bookId, index) => {
            const book = books.find(b => b.id === bookId);
            if (book && book.canonicalOrder === index + 1) {
                canonicalCorrect++;
            }
        });

        correctChronologicalOrder.forEach((bookId, index) => {
            const book = books.find(b => b.id === bookId);
            if (book && book.chronologicalOrder === index + 1) {
                chronologicalCorrect++;
            }
        });

        console.log(`✅ Canonical order: ${canonicalCorrect}/66 correct`);
        console.log(`✅ Chronological order: ${chronologicalCorrect}/66 correct`);

        if (canonicalCorrect === 66 && chronologicalCorrect === 66) {
            console.log('\n🎉 SUCCESS: All book orders are now correct!');
        } else {
            console.log('\n⚠️  Some orders may still be incorrect. Please review manually.');
        }

    } catch (error) {
        console.error('❌ Error in final verification:', error.message);
    }
}

// Run the verification and fixing process
verifyAndFixBookOrders();
