#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the bible-books.json file
const bibleBooksPath = path.join(__dirname, 'src', 'data', 'bible-books.json');

function showChronologicalOrder() {
    try {
        console.log('📖 Chronological Order of Bible Books\n');
        
        // Read the bible-books.json file
        const bibleBooksData = JSON.parse(fs.readFileSync(bibleBooksPath, 'utf8'));
        const books = bibleBooksData.books;

        if (!books || !Array.isArray(books)) {
            console.error('❌ Error: Invalid bible-books.json structure');
            return;
        }

        console.log(`📚 Total books found: ${books.length}\n`);

        // Sort books by chronological order
        const sortedBooks = books.sort((a, b) => a.chronologicalOrder - b.chronologicalOrder);

        // Display chronological order
        console.log('📋 CHRONOLOGICAL ORDER (Historical Timeline):\n');
        console.log('Order'.padEnd(8) + 'Book Name'.padEnd(25) + 'Testament'.padEnd(15) + 'Chapters'.padEnd(10) + 'Author');
        console.log('-'.repeat(80));

        sortedBooks.forEach(book => {
            const order = book.chronologicalOrder;
            const name = book.name;
            const testament = book.testament;
            const chapters = book.chapters;
            const author = book.author || 'Unknown';
            
            console.log(
                order.toString().padEnd(8) + 
                name.padEnd(25) + 
                testament.padEnd(15) + 
                chapters.toString().padEnd(10) + 
                author
            );
        });

        // Summary by testament
        console.log('\n📊 SUMMARY BY TESTAMENT:');
        const oldTestament = sortedBooks.filter(book => book.testament === 'Old Testament');
        const newTestament = sortedBooks.filter(book => book.testament === 'New Testament');
        
        console.log(`Old Testament: ${oldTestament.length} books`);
        console.log(`New Testament: ${newTestament.length} books`);

        // Show chronological timeline with approximate dates
        console.log('\n🕰️  CHRONOLOGICAL TIMELINE WITH APPROXIMATE DATES:');
        console.log('Old Testament Timeline:');
        
        const timelineGroups = [
            { range: '1-5', era: 'Patriarchal Era (~2000-1500 BC)', books: ['Genesis', 'Job'] },
            { range: '3-6', era: 'Exodus & Conquest (~1500-1200 BC)', books: ['Exodus', 'Leviticus', 'Numbers', 'Deuteronomy', 'Joshua'] },
            { range: '7-12', era: 'Judges & United Kingdom (~1200-930 BC)', books: ['Judges', 'Ruth', '1 Samuel', '2 Samuel', '1 Kings', '1 Chronicles'] },
            { range: '13-19', era: 'United Kingdom (~1000-930 BC)', books: ['2 Chronicles', 'Psalms', 'Proverbs', 'Ecclesiastes', 'Song of Solomon', '2 Kings'] },
            { range: '20-39', era: 'Divided Kingdom & Exile (~930-430 BC)', books: ['Obadiah', 'Joel', 'Amos', 'Hosea', 'Jonah', 'Isaiah', 'Micah', 'Nahum', 'Zephaniah', 'Jeremiah', 'Habakkuk', 'Lamentations', 'Ezekiel', 'Daniel', 'Haggai', 'Zechariah', 'Ezra', 'Nehemiah', 'Esther', 'Malachi'] }
        ];

        timelineGroups.forEach(group => {
            console.log(`\n${group.era}:`);
            const relevantBooks = sortedBooks.filter(book => 
                group.books.includes(book.name)
            ).sort((a, b) => a.chronologicalOrder - b.chronologicalOrder);
            
            relevantBooks.forEach(book => {
                console.log(`  ${book.chronologicalOrder}. ${book.name} (${book.chapters} chapters)`);
            });
        });

        console.log('\nNew Testament Timeline:');
        const ntTimelineGroups = [
            { range: '40-43', era: 'Early Church (~AD 45-70)', books: ['James', 'Galatians', '1 Thessalonians', '2 Thessalonians', '1 Corinthians', '2 Corinthians', 'Romans', 'Mark', 'Matthew', 'Luke', 'Acts', 'Ephesians', 'Philippians', 'Colossians', 'Philemon', '1 Timothy', 'Titus', '1 Peter', '2 Timothy', '2 Peter', 'Hebrews', 'Jude'] },
            { range: '44-66', era: 'Later Writings (~AD 85-95)', books: ['John', '1 John', '2 John', '3 John', 'Revelation'] }
        ];

        ntTimelineGroups.forEach(group => {
            console.log(`\n${group.era}:`);
            const relevantBooks = sortedBooks.filter(book => 
                group.books.includes(book.name)
            ).sort((a, b) => a.chronologicalOrder - b.chronologicalOrder);
            
            relevantBooks.forEach(book => {
                console.log(`  ${book.chronologicalOrder}. ${book.name} (${book.chapters} chapters)`);
            });
        });

        // Verify chronological order integrity
        console.log('\n🔍 VERIFYING CHRONOLOGICAL ORDER INTEGRITY:');
        let orderIntegrity = true;
        let duplicateOrders = [];
        let seenOrders = new Set();
        
        for (let i = 0; i < sortedBooks.length; i++) {
            const order = sortedBooks[i].chronologicalOrder;
            
            if (seenOrders.has(order)) {
                duplicateOrders.push({ order, book: sortedBooks[i].name });
                orderIntegrity = false;
            } else {
                seenOrders.add(order);
            }
        }
        
        if (duplicateOrders.length > 0) {
            console.log('❌ Duplicate chronological orders found:');
            duplicateOrders.forEach(dup => {
                console.log(`   Order ${dup.order}: ${dup.book}`);
            });
        }
        
        if (orderIntegrity) {
            console.log('✅ Chronological order integrity verified - no duplicates found');
        } else {
            console.log('❌ Chronological order integrity issues found');
        }

        // Show key chronological insights
        console.log('\n💡 CHRONOLOGICAL ORDER INSIGHTS:');
        console.log('• This order represents when books were likely written or events occurred');
        console.log('• Old Testament spans from ~2000 BC (Genesis) to ~430 BC (Malachi)');
        console.log('• New Testament spans from ~AD 45 (James) to ~AD 95 (Revelation)');
        console.log('• Some books overlap in time periods (e.g., multiple prophets during divided kingdom)');
        console.log('• The chronological order differs significantly from canonical order');
        console.log('• This arrangement helps understand historical context and biblical timeline');

    } catch (error) {
        console.error('❌ Error reading or parsing bible-books.json:', error.message);
    }
}

// Run the display
showChronologicalOrder();
