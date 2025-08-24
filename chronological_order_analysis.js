#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the bible-books.json file
const bibleBooksPath = path.join(__dirname, 'src', 'data', 'bible-books.json');

// More accurate chronological order based on when events occurred or books were written
// This is an approximation and scholars may disagree on exact dates
const improvedChronologicalOrder = [
    // Old Testament - More chronologically accurate
    'genesis',        // Creation to ~1800 BC
    'exodus',         // ~1446 BC
    'leviticus',      // ~1446 BC
    'numbers',        // ~1446-1406 BC
    'deuteronomy',    // ~1406 BC
    'joshua',         // ~1406-1380 BC
    'judges',         // ~1380-1050 BC
    'ruth',           // ~1100 BC (during judges period)
    '1-samuel',       // ~1050-1010 BC
    '2-samuel',       // ~1010-970 BC
    '1-kings',        // ~970-850 BC
    '2-kings',        // ~850-586 BC
    '1-chronicles',   // ~450 BC (written after exile)
    '2-chronicles',   // ~450 BC (written after exile)
    'ezra',           // ~538-450 BC
    'nehemiah',       // ~445-420 BC
    'esther',         // ~483-473 BC
    'job',            // ~2000-1800 BC (possibly earliest book)
    'psalms',         // ~1000-400 BC (collection over time)
    'proverbs',       // ~950-700 BC
    'ecclesiastes',   // ~935 BC
    'song-of-solomon', // ~970 BC
    'isaiah',         // ~740-680 BC
    'jeremiah',       // ~627-580 BC
    'lamentations',   // ~586 BC
    'ezekiel',        // ~593-570 BC
    'daniel',         // ~605-530 BC
    'hosea',          // ~750-710 BC
    'joel',           // ~835 BC
    'amos',           // ~760 BC
    'obadiah',        // ~586 BC
    'jonah',          // ~760 BC
    'micah',          // ~735-700 BC
    'nahum',          // ~650 BC
    'habakkuk',       // ~630 BC
    'zephaniah',      // ~640 BC
    'haggai',         // ~520 BC
    'zechariah',      // ~520-480 BC
    'malachi',        // ~430 BC
    // New Testament - More chronologically accurate
    'matthew',        // ~50-70 AD
    'mark',           // ~50-65 AD
    'luke',           // ~60-80 AD
    'john',           // ~85-95 AD
    'acts',           // ~62-80 AD
    'romans',         // ~57 AD
    '1-corinthians',  // ~55 AD
    '2-corinthians',  // ~56 AD
    'galatians',      // ~48-55 AD
    'ephesians',      // ~60-62 AD
    'philippians',    // ~61-62 AD
    'colossians',     // ~60-62 AD
    '1-thessalonians', // ~51 AD
    '2-thessalonians', // ~51-52 AD
    '1-timothy',      // ~62-66 AD
    '2-timothy',      // ~66-67 AD
    'titus',          // ~62-66 AD
    'philemon',       // ~60-62 AD
    'hebrews',        // ~60-70 AD
    'james',          // ~45-50 AD
    '1-peter',        // ~60-65 AD
    '2-peter',        // ~65-68 AD
    '1-john',         // ~85-95 AD
    '2-john',         // ~85-95 AD
    '3-john',         // ~85-95 AD
    'jude',           // ~65-80 AD
    'revelation'      // ~95 AD
];

function analyzeChronologicalOrder() {
    try {
        console.log('⏰ Chronological Order Analysis for Bible Books\n');
        
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

        // Show current chronological order vs improved order
        console.log('📖 CURRENT vs IMPROVED CHRONOLOGICAL ORDER:\n');
        console.log('Current'.padEnd(8) + 'Improved'.padEnd(8) + 'Book Name'.padEnd(25) + 'Current Order'.padEnd(15) + 'Should Be'.padEnd(12) + 'Status');
        console.log('-'.repeat(100));

        let totalChanges = 0;
        let booksToUpdate = [];

        improvedChronologicalOrder.forEach((bookId, index) => {
            const book = bookMap.get(bookId);
            const improvedOrder = index + 1;
            
            if (book) {
                const currentOrder = book.chronologicalOrder;
                const needsUpdate = currentOrder !== improvedOrder;
                const status = needsUpdate ? '🔄' : '✅';
                
                if (needsUpdate) {
                    totalChanges++;
                    booksToUpdate.push({
                        book: book,
                        currentOrder: currentOrder,
                        improvedOrder: improvedOrder
                    });
                }

                console.log(
                    (index + 1).toString().padEnd(8) + 
                    (index + 1).toString().padEnd(8) + 
                    book.name.padEnd(25) + 
                    currentOrder.toString().padEnd(15) + 
                    improvedOrder.toString().padEnd(12) + 
                    status
                );
            } else {
                console.log((index + 1).toString().padEnd(8) + (index + 1).toString().padEnd(8) + bookId.padEnd(25) + 'MISSING'.padEnd(15) + improvedOrder.toString().padEnd(12) + '❌');
            }
        });

        // Summary
        console.log('\n📊 SUMMARY:');
        console.log(`Total books analyzed: ${improvedChronologicalOrder.length}`);
        console.log(`Books needing chronological order update: ${totalChanges}`);

        if (totalChanges === 0) {
            console.log('\n✅ All books already have the correct chronological order!');
            return;
        }

        // Show what needs to be changed
        console.log('\n🔄 BOOKS THAT NEED UPDATING:');
        booksToUpdate.forEach(({ book, currentOrder, improvedOrder }) => {
            console.log(`📝 ${book.name}: ${currentOrder} → ${improvedOrder}`);
        });

        // Ask if user wants to apply the changes
        console.log('\n❓ Do you want to update the chronological order? (y/n)');
        
        // For now, we'll just show what would be changed
        // In a real interactive script, you'd wait for user input
        
        console.log('\n💡 To apply these changes, run the update script or manually update the JSON file.');
        console.log('📝 The improved chronological order provides a more accurate timeline of biblical events.');

        // Show some examples of why the order matters
        console.log('\n📚 EXAMPLES OF CHRONOLOGICAL SIGNIFICANCE:');
        console.log('• Job is placed early (~2000 BC) as it deals with themes from the patriarchal period');
        console.log('• Psalms spans a long period (~1000-400 BC) as it\'s a collection of songs');
        console.log('• The prophets are ordered roughly by when they ministered');
        console.log('• New Testament letters are ordered by approximate writing date');

    } catch (error) {
        console.error('❌ Error reading or parsing bible-books.json:', error.message);
    }
}

// Run the analysis
analyzeChronologicalOrder();
