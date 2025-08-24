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

function detailedOrderCheck() {
    try {
        console.log('🔍 Detailed Order Check for Bible Books\n');
        
        // Read the bible-books.json file
        const bibleBooksData = JSON.parse(fs.readFileSync(bibleBooksPath, 'utf8'));
        const books = bibleBooksData.books;

        if (!books || !Array.isArray(books)) {
            console.error('❌ Error: Invalid bible-books.json structure');
            return;
        }

        console.log(`📚 Total books found: ${books.length}\n`);

        // Create a map for easy lookup
        const bookMap = new Map();
        books.forEach(book => bookMap.set(book.id, book));

        // Check each expected book
        console.log('📖 DETAILED ORDER ANALYSIS:\n');
        console.log('Book ID'.padEnd(20) + 'Name'.padEnd(20) + 'Canonical'.padEnd(12) + 'Chronological'.padEnd(15) + 'Status');
        console.log('-'.repeat(90));

        let totalIssues = 0;
        let canonicalIssues = 0;
        let chronologicalIssues = 0;

        expectedCanonicalOrder.forEach((bookId, index) => {
            const book = bookMap.get(bookId);
            const expectedOrder = index + 1;
            
            if (book) {
                const canonicalStatus = book.canonicalOrder === expectedOrder ? '✅' : '❌';
                const chronologicalStatus = book.chronologicalOrder === expectedOrder ? '✅' : '❌';
                
                if (book.canonicalOrder !== expectedOrder) {
                    canonicalIssues++;
                    totalIssues++;
                }
                
                if (book.chronologicalOrder !== expectedOrder) {
                    chronologicalIssues++;
                    totalIssues++;
                }

                const status = canonicalStatus + ' ' + chronologicalStatus;
                console.log(
                    bookId.padEnd(20) + 
                    book.name.padEnd(20) + 
                    book.canonicalOrder.toString().padEnd(12) + 
                    book.chronologicalOrder.toString().padEnd(15) + 
                    status
                );
            } else {
                console.log(bookId.padEnd(20) + 'MISSING'.padEnd(20) + 'N/A'.padEnd(12) + 'N/A'.padEnd(15) + '❌');
                totalIssues++;
            }
        });

        // Summary
        console.log('\n📊 SUMMARY:');
        console.log(`Total books checked: ${expectedCanonicalOrder.length}`);
        console.log(`Canonical order issues: ${canonicalIssues}`);
        console.log(`Chronological order issues: ${chronologicalIssues}`);
        console.log(`Total issues: ${totalIssues}`);

        if (totalIssues === 0) {
            console.log('\n✅ All book orders are correct!');
        } else {
            console.log('\n❌ Issues found that need to be fixed.');
            
            // Show specific issues
            console.log('\n🔍 ISSUE DETAILS:');
            expectedCanonicalOrder.forEach((bookId, index) => {
                const book = bookMap.get(bookId);
                const expectedOrder = index + 1;
                
                if (book) {
                    if (book.canonicalOrder !== expectedOrder) {
                        console.log(`❌ ${book.name}: canonicalOrder ${book.canonicalOrder}, should be ${expectedOrder}`);
                    }
                    if (book.chronologicalOrder !== expectedOrder) {
                        console.log(`❌ ${book.name}: chronologicalOrder ${book.chronologicalOrder}, should be ${expectedOrder}`);
                    }
                } else {
                    console.log(`❌ Missing book: ${bookId}`);
                }
            });
        }

        // Check for any books with duplicate order numbers
        console.log('\n🔍 Checking for duplicate order numbers...');
        const canonicalOrders = books.map(book => book.canonicalOrder).sort((a, b) => a - b);
        const chronologicalOrders = books.map(book => book.chronologicalOrder).sort((a, b) => a - b);
        
        const canonicalDuplicates = canonicalOrders.filter((order, index) => order === canonicalOrders[index - 1]);
        const chronologicalDuplicates = chronologicalOrders.filter((order, index) => order === chronologicalOrders[index - 1]);
        
        if (canonicalDuplicates.length > 0) {
            console.log(`⚠️  Duplicate canonical orders found: ${canonicalDuplicates.join(', ')}`);
        } else {
            console.log('✅ No duplicate canonical orders found');
        }
        
        if (chronologicalDuplicates.length > 0) {
            console.log(`⚠️  Duplicate chronological orders found: ${chronologicalDuplicates.join(', ')}`);
        } else {
            console.log('✅ No duplicate chronological orders found');
        }

    } catch (error) {
        console.error('❌ Error reading or parsing bible-books.json:', error.message);
    }
}

// Run the detailed check
detailedOrderCheck();
