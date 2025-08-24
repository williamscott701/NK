#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the bible-books.json file
const bibleBooksPath = path.join(__dirname, 'src', 'data', 'bible-books.json');

// Historically accurate chronological order based on when events occurred or books were written
// This is an approximation and scholars may disagree on exact dates
const correctChronologicalOrder = [
    // Old Testament - Chronologically ordered by events/writing
    'genesis',        // Creation to ~1800 BC (events)
    'exodus',         // ~1446 BC (events)
    'leviticus',      // ~1446 BC (events)
    'numbers',        // ~1446-1406 BC (events)
    'deuteronomy',    // ~1406 BC (events)
    'joshua',         // ~1406-1380 BC (events)
    'judges',         // ~1380-1050 BC (events)
    'ruth',           // ~1100 BC (during judges period)
    '1-samuel',       // ~1050-1010 BC (events)
    '2-samuel',       // ~1010-970 BC (events)
    '1-kings',        // ~970-850 BC (events)
    '2-kings',        // ~850-586 BC (events)
    'job',            // ~2000-1800 BC (possibly earliest book written)
    'psalms',         // ~1000-400 BC (collection over time)
    'proverbs',       // ~950-700 BC (written)
    'ecclesiastes',   // ~935 BC (written)
    'song-of-solomon', // ~970 BC (written)
    'isaiah',         // ~740-680 BC (written)
    'hosea',          // ~750-710 BC (written)
    'joel',           // ~835 BC (written)
    'amos',           // ~760 BC (written)
    'jonah',          // ~760 BC (written)
    'micah',          // ~735-700 BC (written)
    'nahum',          // ~650 BC (written)
    'habakkuk',       // ~630 BC (written)
    'zephaniah',      // ~640 BC (written)
    'jeremiah',       // ~627-580 BC (written)
    'lamentations',   // ~586 BC (written)
    'ezekiel',        // ~593-570 BC (written)
    'daniel',         // ~605-530 BC (written)
    'obadiah',        // ~586 BC (written)
    'haggai',         // ~520 BC (written)
    'zechariah',      // ~520-480 BC (written)
    'malachi',        // ~430 BC (written)
    'esther',         // ~483-473 BC (events)
    'ezra',           // ~538-450 BC (events)
    'nehemiah',       // ~445-420 BC (events)
    '1-chronicles',   // ~450 BC (written after exile)
    '2-chronicles',   // ~450 BC (written after exile)
    // New Testament - Chronologically ordered by writing date
    'james',          // ~45-50 AD (earliest NT book)
    'galatians',      // ~48-55 AD
    '1-thessalonians', // ~51 AD
    '2-thessalonians', // ~51-52 AD
    '1-corinthians',  // ~55 AD
    '2-corinthians',  // ~56 AD
    'romans',         // ~57 AD
    'philemon',       // ~60-62 AD
    'colossians',     // ~60-62 AD
    'ephesians',      // ~60-62 AD
    'philippians',    // ~61-62 AD
    '1-timothy',      // ~62-66 AD
    'titus',          // ~62-66 AD
    '1-peter',        // ~60-65 AD
    '2-peter',        // ~65-68 AD
    'hebrews',        // ~60-70 AD
    'acts',           // ~62-80 AD (written)
    'matthew',        // ~50-70 AD (written)
    'mark',           // ~50-65 AD (written)
    'luke',           // ~60-80 AD (written)
    'jude',           // ~65-80 AD
    '2-timothy',      // ~66-67 AD
    'john',           // ~85-95 AD (written)
    '1-john',         // ~85-95 AD
    '2-john',         // ~85-95 AD
    '3-john',         // ~85-95 AD
    'revelation'      // ~95 AD (last NT book)
];

function fixChronologicalOrder() {
    try {
        console.log('🔧 Fixing Chronological Order for Bible Books\n');
        
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

        // Check if all expected books are present
        const missingBooks = correctChronologicalOrder.filter(id => !bookMap.has(id));
        if (missingBooks.length > 0) {
            console.log(`❌ Missing books: ${missingBooks.join(', ')}`);
            return;
        }

        // Show what will be changed
        console.log('📖 CHANGES TO BE MADE:\n');
        console.log('Book Name'.padEnd(25) + 'Current Order'.padEnd(15) + 'New Order'.padEnd(12) + 'Change');
        console.log('-'.repeat(70));

        let totalChanges = 0;
        let changes = [];

        correctChronologicalOrder.forEach((bookId, index) => {
            const book = bookMap.get(bookId);
            const newOrder = index + 1;
            const currentOrder = book.chronologicalOrder;
            
            if (currentOrder !== newOrder) {
                const change = currentOrder > newOrder ? '⬆️' : '⬇️';
                console.log(
                    book.name.padEnd(25) + 
                    currentOrder.toString().padEnd(15) + 
                    newOrder.toString().padEnd(12) + 
                    change
                );
                totalChanges++;
                changes.push({ book, currentOrder, newOrder });
            }
        });

        if (totalChanges === 0) {
            console.log('\n✅ Chronological order is already correct! No changes needed.');
            return;
        }

        // Summary of changes
        console.log('\n📊 SUMMARY:');
        console.log(`Total books: ${books.length}`);
        console.log(`Books to be updated: ${totalChanges}`);
        console.log(`Books staying the same: ${books.length - totalChanges}`);

        // Apply the changes
        console.log('\n🔧 Applying chronological order updates...');
        changes.forEach(({ book, newOrder }) => {
            book.chronologicalOrder = newOrder;
        });

        // Verify the changes
        console.log('\n🔍 Verifying changes...');
        let verificationPassed = true;
        
        correctChronologicalOrder.forEach((bookId, index) => {
            const book = bookMap.get(bookId);
            const expectedOrder = index + 1;
            
            if (book.chronologicalOrder !== expectedOrder) {
                console.log(`❌ ${book.name}: chronologicalOrder ${book.chronologicalOrder}, should be ${expectedOrder}`);
                verificationPassed = false;
            }
        });

        if (verificationPassed) {
            console.log('✅ All changes verified successfully!');
            
            // Save the updated data back to the file
            console.log('\n💾 Saving updated data to bible-books.json...');
            fs.writeFileSync(bibleBooksPath, JSON.stringify(bibleBooksData, null, 2));
            console.log('✅ File updated successfully!');
            
            // Show the new chronological order
            console.log('\n📖 NEW CHRONOLOGICAL ORDER:');
            console.log('Order'.padEnd(8) + 'Book Name'.padEnd(25) + 'Testament'.padEnd(15) + 'Approximate Date');
            console.log('-'.repeat(70));
            
            correctChronologicalOrder.forEach((bookId, index) => {
                const book = bookMap.get(bookId);
                const order = index + 1;
                const testament = book.testament;
                
                // Get approximate date based on position
                let date = '';
                if (order <= 5) date = '~2000-1400 BC';
                else if (order <= 17) date = '~1400-1000 BC';
                else if (order <= 39) date = '~1000-400 BC';
                else if (order <= 45) date = '~45-80 AD';
                else date = '~60-95 AD';
                
                console.log(
                    order.toString().padEnd(8) + 
                    book.name.padEnd(25) + 
                    testament.padEnd(15) + 
                    date
                );
            });
            
            console.log('\n🎉 Chronological order has been successfully updated!');
            console.log('📝 The new order reflects when events occurred or when books were written,');
            console.log('   rather than the traditional canonical order.');
            
        } else {
            console.log('❌ Verification failed. Please check the data manually.');
        }

    } catch (error) {
        console.error('❌ Error processing bible-books.json:', error.message);
    }
}

// Run the fix
fixChronologicalOrder();
