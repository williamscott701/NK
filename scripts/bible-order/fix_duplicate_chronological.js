#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the bible-books.json file
const bibleBooksPath = path.join(__dirname, 'src', 'data', 'bible-books.json');

// Corrected chronological order ensuring no duplicates
const correctedChronologicalOrder = [
    // Old Testament - Chronologically ordered by events/writing
    'genesis',        // 1. Creation to ~1800 BC
    'job',            // 2. Patriarchal era, during or near Abraham's time
    'exodus',         // 3. ~1446 BC
    'leviticus',      // 4. ~1446 BC
    'numbers',        // 5. ~1446-1406 BC
    'deuteronomy',    // 6. ~1406 BC
    'joshua',         // 7. ~1406-1380 BC
    'judges',         // 8. ~1380-1050 BC
    'ruth',           // 9. ~1100 BC (during judges period)
    '1-samuel',       // 10. ~1050-1010 BC
    '2-samuel',       // 11. ~1010-970 BC
    '1-chronicles',   // 12. ~450 BC (written after exile)
    'psalms',         // 13. Many written during David's reign, others later
    'proverbs',       // 14. Mostly Solomon
    'ecclesiastes',   // 15. Solomon
    'song-of-solomon', // 16. Solomon
    '1-kings',        // 17. ~970-850 BC
    '2-kings',        // 18. ~850-586 BC
    '2-chronicles',   // 19. ~450 BC (written after exile)
    'obadiah',        // 20. ~586 BC
    'joel',           // 21. ~835 BC
    'amos',           // 22. ~760 BC
    'hosea',          // 23. ~750-710 BC
    'isaiah',         // 24. ~740-680 BC
    'micah',          // 25. ~735-700 BC
    'nahum',          // 26. ~650 BC
    'zephaniah',      // 27. ~640 BC
    'jeremiah',       // 28. ~627-580 BC
    'habakkuk',       // 29. ~630 BC
    'lamentations',   // 30. ~586 BC
    'ezekiel',        // 31. ~593-570 BC
    'daniel',         // 32. ~605-530 BC
    'haggai',         // 33. ~520 BC
    'zechariah',      // 34. ~520-480 BC
    'ezra',           // 35. ~538-450 BC
    'nehemiah',       // 36. ~445-420 BC
    'esther',         // 37. ~483-473 BC
    'malachi',        // 38. ~430 BC (OT closes, ~400 years of silence until Christ)
    // New Testament - Chronologically ordered by writing date
    'james',          // 39. ~AD 45, earliest NT book
    'galatians',      // 40. ~AD 48
    '1-thessalonians', // 41. ~AD 50
    '2-thessalonians', // 42. ~AD 51
    '1-corinthians',  // 43. ~AD 55
    '2-corinthians',  // 44. ~AD 56
    'romans',         // 45. ~AD 57
    'mark',           // 46. ~AD 55-65, earliest Gospel
    'matthew',        // 47. ~AD 60s
    'luke',           // 48. ~AD 60s
    'acts',           // 49. ~AD 62
    'ephesians',      // 50. ~AD 62
    'philippians',    // 51. ~AD 62
    'colossians',     // 52. ~AD 62
    'philemon',       // 53. ~AD 62
    '1-timothy',      // 54. ~AD 63
    'titus',          // 55. ~AD 63
    '1-peter',        // 56. ~AD 64
    '2-timothy',      // 57. ~AD 66-67
    '2-peter',        // 58. ~AD 67-68
    'hebrews',        // 59. ~AD 67-69
    'jude',           // 60. ~AD 68-70
    'john',           // 61. ~AD 85-90
    '1-john',         // 62. ~AD 90s
    '2-john',         // 63. ~AD 90s
    '3-john',         // 64. ~AD 90s
    'revelation'      // 65. ~AD 95, final NT book
];

function fixDuplicateChronological() {
    try {
        console.log('🔧 Fixing Duplicate Chronological Order Issues\n');
        
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

        // Check for duplicate chronological orders
        console.log('🔍 Checking for duplicate chronological orders...');
        const chronologicalOrders = books.map(book => book.chronologicalOrder).sort((a, b) => a - b);
        const duplicates = chronologicalOrders.filter((order, index) => order === chronologicalOrders[index - 1]);
        
        if (duplicates.length > 0) {
            console.log(`⚠️  Found duplicate chronological orders: ${duplicates.join(', ')}`);
            
            // Show which books have duplicate orders
            duplicates.forEach(duplicateOrder => {
                const booksWithOrder = books.filter(book => book.chronologicalOrder === duplicateOrder);
                console.log(`   Position ${duplicateOrder}: ${booksWithOrder.map(b => b.name).join(', ')}`);
            });
        } else {
            console.log('✅ No duplicate chronological orders found');
        }

        // Check if all expected books are present
        const missingBooks = correctedChronologicalOrder.filter(id => !bookMap.has(id));
        if (missingBooks.length > 0) {
            console.log(`❌ Missing books: ${missingBooks.join(', ')}`);
            return;
        }

        // Show what will be changed
        console.log('\n📖 APPLYING CORRECTED CHRONOLOGICAL ORDER:\n');
        console.log('Book Name'.padEnd(25) + 'Current Order'.padEnd(15) + 'New Order'.padEnd(12) + 'Change');
        console.log('-'.repeat(70));

        let totalChanges = 0;
        let changes = [];

        correctedChronologicalOrder.forEach((bookId, index) => {
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
        console.log('\n🔧 Applying corrected chronological order...');
        changes.forEach(({ book, newOrder }) => {
            book.chronologicalOrder = newOrder;
        });

        // Verify the changes
        console.log('\n🔍 Verifying changes...');
        let verificationPassed = true;
        
        correctedChronologicalOrder.forEach((bookId, index) => {
            const book = bookMap.get(bookId);
            const expectedOrder = index + 1;
            
            if (book.chronologicalOrder !== expectedOrder) {
                console.log(`❌ ${book.name}: chronologicalOrder ${book.chronologicalOrder}, should be ${expectedOrder}`);
                verificationPassed = false;
            }
        });

        // Check for duplicates after fix
        const newChronologicalOrders = books.map(book => book.chronologicalOrder).sort((a, b) => a - b);
        const newDuplicates = newChronologicalOrders.filter((order, index) => order === newChronologicalOrders[index - 1]);
        
        if (newDuplicates.length > 0) {
            console.log(`❌ Still have duplicate chronological orders: ${newDuplicates.join(', ')}`);
            verificationPassed = false;
        } else {
            console.log('✅ No duplicate chronological orders found after fix');
        }

        if (verificationPassed) {
            console.log('✅ All changes verified successfully!');
            
            // Save the updated data back to the file
            console.log('\n💾 Saving corrected data to bible-books.json...');
            fs.writeFileSync(bibleBooksPath, JSON.stringify(bibleBooksData, null, 2));
            console.log('✅ File updated successfully!');
            
            // Show the final chronological order
            console.log('\n📖 FINAL CHRONOLOGICAL ORDER (Corrected):');
            console.log('Order'.padEnd(8) + 'Book Name'.padEnd(25) + 'Testament'.padEnd(15) + 'Approximate Date');
            console.log('-'.repeat(70));
            
            correctedChronologicalOrder.forEach((bookId, index) => {
                const book = bookMap.get(bookId);
                const order = index + 1;
                const testament = book.testament;
                
                // Get approximate date based on position
                let date = '';
                if (order <= 2) date = '~2000-1800 BC';
                else if (order <= 6) date = '~1446-1406 BC';
                else if (order <= 12) date = '~1406-1000 BC';
                else if (order <= 16) date = '~1000-970 BC';
                else if (order <= 19) date = '~970-450 BC';
                else if (order <= 38) date = '~835-430 BC';
                else if (order <= 46) date = '~45-65 AD';
                else if (order <= 49) date = '~60-62 AD';
                else if (order <= 60) date = '~62-70 AD';
                else date = '~85-95 AD';
                
                console.log(
                    order.toString().padEnd(8) + 
                    book.name.padEnd(25) + 
                    testament.padEnd(15) + 
                    date
                );
            });
            
            console.log('\n🎉 Duplicate chronological order issues have been fixed!');
            console.log('📝 The chronological order now follows your specification exactly:');
            console.log('   • Job at position 2 (patriarchal era)');
            console.log('   • Amos at position 22 (no duplicates)');
            console.log('   • All books have unique chronological positions');
            
        } else {
            console.log('❌ Verification failed. Please check the data manually.');
        }

    } catch (error) {
        console.error('❌ Error processing bible-books.json:', error.message);
    }
}

// Run the fix
fixDuplicateChronological();
