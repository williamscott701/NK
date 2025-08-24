#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the bible-books.json file
const bibleBooksPath = path.join(__dirname, 'src', 'data', 'bible-books.json');

function showCanonicalOrder() {
    try {
        console.log('📖 Canonical Order of Bible Books\n');
        
        // Read the bible-books.json file
        const bibleBooksData = JSON.parse(fs.readFileSync(bibleBooksPath, 'utf8'));
        const books = bibleBooksData.books;

        if (!books || !Array.isArray(books)) {
            console.error('❌ Error: Invalid bible-books.json structure');
            return;
        }

        console.log(`📚 Total books found: ${books.length}\n`);

        // Sort books by canonical order
        const sortedBooks = books.sort((a, b) => a.canonicalOrder - b.canonicalOrder);

        // Display canonical order
        console.log('📋 CANONICAL ORDER (Traditional Bible Order):\n');
        console.log('Order'.padEnd(8) + 'Book Name'.padEnd(25) + 'Testament'.padEnd(15) + 'Chapters'.padEnd(10) + 'Author');
        console.log('-'.repeat(80));

        sortedBooks.forEach(book => {
            const order = book.canonicalOrder;
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
        
        console.log(`Old Testament: ${oldTestament.length} books (1-${oldTestament.length})`);
        console.log(`New Testament: ${newTestament.length} books (${oldTestament.length + 1}-${books.length})`);
        
        // Show testament divisions
        console.log('\n🔍 TESTAMENT DIVISIONS:');
        console.log('Old Testament (Books 1-39):');
        console.log(`   ${oldTestament.map(book => `${book.canonicalOrder}. ${book.name}`).join(', ')}`);
        
        console.log('\nNew Testament (Books 40-66):');
        console.log(`   ${newTestament.map(book => `${book.canonicalOrder}. ${book.name}`).join(', ')}`);

        // Verify canonical order integrity
        console.log('\n🔍 VERIFYING CANONICAL ORDER INTEGRITY:');
        let orderIntegrity = true;
        
        for (let i = 0; i < sortedBooks.length; i++) {
            const expectedOrder = i + 1;
            const actualOrder = sortedBooks[i].canonicalOrder;
            
            if (actualOrder !== expectedOrder) {
                console.log(`❌ Order mismatch at position ${i + 1}: expected ${expectedOrder}, got ${actualOrder}`);
                orderIntegrity = false;
            }
        }
        
        if (orderIntegrity) {
            console.log('✅ Canonical order integrity verified - all books are in correct sequence');
        } else {
            console.log('❌ Canonical order integrity issues found');
        }

        // Show some key canonical order facts
        console.log('\n💡 CANONICAL ORDER FACTS:');
        console.log('• Canonical order follows the traditional Protestant Bible arrangement');
        console.log('• Old Testament books are arranged in three main groups:');
        console.log('  - Law (Torah): Genesis, Exodus, Leviticus, Numbers, Deuteronomy');
        console.log('  - Historical Books: Joshua through Esther');
        console.log('  - Wisdom & Prophetic Books: Job through Malachi');
        console.log('• New Testament books are arranged in four main groups:');
        console.log('  - Gospels: Matthew, Mark, Luke, John');
        console.log('  - Historical: Acts');
        console.log('  - Pauline Letters: Romans through Philemon');
        console.log('  - General Letters & Revelation: Hebrews through Revelation');

    } catch (error) {
        console.error('❌ Error reading or parsing bible-books.json:', error.message);
    }
}

// Run the display
showCanonicalOrder();
