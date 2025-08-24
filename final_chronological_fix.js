#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the bible-books.json file
const bibleBooksPath = path.join(__dirname, 'src', 'data', 'bible-books.json');

// Final chronological order based on user's corrected specification (including Jonah)
const finalChronologicalOrder = [
    // Old Testament - Exactly as specified by user (corrected with Jonah)
    'genesis',        // 1. Genesis
    'job',            // 2. Job (patriarchal era, during or near Abraham's time)
    'exodus',         // 3. Exodus
    'leviticus',      // 4. Leviticus
    'numbers',        // 5. Numbers
    'deuteronomy',    // 6. Deuteronomy
    'joshua',         // 7. Joshua
    'judges',         // 8. Judges
    'ruth',           // 9. Ruth
    '1-samuel',       // 10. 1 Samuel
    '2-samuel',       // 11. 2 Samuel
    '1-chronicles',   // 12. 1 Chronicles
    'psalms',         // 13. Psalms (many written during David's reign, others later)
    'proverbs',       // 14. Proverbs (mostly Solomon)
    'ecclesiastes',   // 15. Ecclesiastes (Solomon)
    'song-of-solomon', // 16. Song of Songs (Solomon)
    '1-kings',        // 17. 1 Kings
    '2-kings',        // 18. 2 Kings
    '2-chronicles',   // 19. 2 Chronicles
    'obadiah',        // 20. Obadiah
    'joel',           // 21. Joel
    'amos',           // 22. Amos
    'hosea',          // 23. Hosea
    'jonah',          // 24. Jonah (sent to Nineveh, ~760 BC) ✅
    'isaiah',         // 25. Isaiah
    'micah',          // 26. Micah
    'nahum',          // 27. Nahum
    'zephaniah',      // 28. Zephaniah
    'jeremiah',       // 29. Jeremiah
    'habakkuk',       // 30. Habakkuk
    'lamentations',   // 31. Lamentations
    'ezekiel',        // 32. Ezekiel
    'daniel',         // 33. Daniel
    'haggai',         // 34. Haggai
    'zechariah',      // 35. Zechariah
    'ezra',           // 36. Ezra
    'nehemiah',       // 37. Nehemiah
    'esther',         // 38. Esther
    'malachi',        // 39. Malachi (OT closes ~430 BC → 400 silent years)
    // New Testament - Exactly as specified by user
    'james',          // 40. James (~AD 45, earliest NT book)
    'galatians',      // 41. Galatians (~AD 48)
    '1-thessalonians', // 42. 1 Thessalonians (~AD 50)
    '2-thessalonians', // 43. 2 Thessalonians (~AD 51)
    '1-corinthians',  // 44. 1 Corinthians (~AD 55)
    '2-corinthians',  // 45. 2 Corinthians (~AD 56)
    'romans',         // 46. Romans (~AD 57)
    'mark',           // 47. Mark (~AD 55–65, earliest Gospel)
    'matthew',        // 48. Matthew (~AD 60s)
    'luke',           // 49. Luke (~AD 60s)
    'acts',           // 50. Acts (~AD 62)
    'ephesians',      // 51. Ephesians (~AD 62)
    'philippians',    // 52. Philippians (~AD 62)
    'colossians',     // 53. Colossians (~AD 62)
    'philemon',       // 54. Philemon (~AD 62)
    '1-timothy',      // 55. 1 Timothy (~AD 63)
    'titus',          // 56. Titus (~AD 63)
    '1-peter',        // 57. 1 Peter (~AD 64)
    '2-timothy',      // 58. 2 Timothy (~AD 66–67)
    '2-peter',        // 59. 2 Peter (~AD 67–68)
    'hebrews',        // 60. Hebrews (~AD 67–69)
    'jude',           // 61. Jude (~AD 68–70)
    'john',           // 62. John (~AD 85–90)
    '1-john',         // 63. 1 John (~AD 90s)
    '2-john',         // 64. 2 John (~AD 90s)
    '3-john',         // 65. 3 John (~AD 90s)
    'revelation'      // 66. Revelation (~AD 95, final NT book)
];

function applyFinalChronologicalOrder() {
    try {
        console.log('🔧 Applying Final Chronological Order (User Corrected Specification)\n');
        
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
        const missingBooks = finalChronologicalOrder.filter(id => !bookMap.has(id));
        if (missingBooks.length > 0) {
            console.log(`❌ Missing books: ${missingBooks.join(', ')}`);
            return;
        }

        // Check for duplicate chronological orders before fixing
        console.log('🔍 Checking for duplicate chronological orders before fix...');
        const chronologicalOrders = books.map(book => book.chronologicalOrder).sort((a, b) => a - b);
        const duplicates = chronologicalOrders.filter((order, index) => order === chronologicalOrders[index - 1]);
        
        if (duplicates.length > 0) {
            console.log(`⚠️  Found duplicate chronological orders: ${duplicates.join(', ')}`);
            duplicates.forEach(duplicateOrder => {
                const booksWithOrder = books.filter(book => book.chronologicalOrder === duplicateOrder);
                console.log(`   Position ${duplicateOrder}: ${booksWithOrder.map(b => b.name).join(', ')}`);
            });
        } else {
            console.log('✅ No duplicate chronological orders found');
        }

        // Show what will be changed
        console.log('\n📖 APPLYING FINAL CHRONOLOGICAL ORDER:\n');
        console.log('Book Name'.padEnd(25) + 'Current Order'.padEnd(15) + 'New Order'.padEnd(12) + 'Change');
        console.log('-'.repeat(70));

        let totalChanges = 0;
        let changes = [];

        finalChronologicalOrder.forEach((bookId, index) => {
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
            console.log('\n✅ Chronological order is already correct according to user specification!');
            return;
        }

        // Summary of changes
        console.log('\n📊 SUMMARY:');
        console.log(`Total books: ${books.length}`);
        console.log(`Books to be updated: ${totalChanges}`);
        console.log(`Books staying the same: ${books.length - totalChanges}`);

        // Apply the changes
        console.log('\n🔧 Applying final chronological order...');
        changes.forEach(({ book, newOrder }) => {
            book.chronologicalOrder = newOrder;
        });

        // Verify the changes
        console.log('\n🔍 Verifying changes...');
        let verificationPassed = true;
        
        finalChronologicalOrder.forEach((bookId, index) => {
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
            console.log('\n💾 Saving final chronological order to bible-books.json...');
            fs.writeFileSync(bibleBooksPath, JSON.stringify(bibleBooksData, null, 2));
            console.log('✅ File updated successfully!');
            
            // Show the final chronological order
            console.log('\n📖 FINAL CHRONOLOGICAL ORDER (User Corrected Specification):');
            console.log('Order'.padEnd(8) + 'Book Name'.padEnd(25) + 'Testament'.padEnd(15) + 'Approximate Date');
            console.log('-'.repeat(70));
            
            finalChronologicalOrder.forEach((bookId, index) => {
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
                else if (order <= 39) date = '~835-430 BC';
                else if (order <= 47) date = '~45-65 AD';
                else if (order <= 50) date = '~60-62 AD';
                else if (order <= 61) date = '~62-70 AD';
                else date = '~85-95 AD';
                
                console.log(
                    order.toString().padEnd(8) + 
                    book.name.padEnd(25) + 
                    testament.padEnd(15) + 
                    date
                );
            });
            
            console.log('\n🎉 Final chronological order has been successfully applied!');
            console.log('📝 The chronological order now follows your corrected specification:');
            console.log('   • Job at position 2 (patriarchal era)');
            console.log('   • Jonah at position 24 (sent to Nineveh, ~760 BC) ✅');
            console.log('   • All books have unique chronological positions');
            console.log('   • No duplicates');
            console.log('   • Follows the exact numbering you provided');
            
            // Highlight the key changes
            console.log('\n🔑 KEY CHANGES MADE:');
            console.log('   • Jonah properly positioned at #24 (after Hosea, before Isaiah)');
            console.log('   • All subsequent books shifted accordingly');
            console.log('   • Historical accuracy improved with Jonah in 8th century BC context');
            
        } else {
            console.log('❌ Verification failed. Please check the data manually.');
        }

    } catch (error) {
        console.error('❌ Error processing bible-books.json:', error.message);
    }
}

// Run the final fix
applyFinalChronologicalOrder();
