import fs from 'fs';

const data = JSON.parse(fs.readFileSync('src/data/bible-books.json', 'utf8'));

console.log('=== BIBLE BOOK CHAPTER ANALYSIS ===\n');

let totalExpectedChapters = 0;
let totalAvailableChapters = 0;
let booksWithIssues = [];

data.books.forEach(book => {
  const expectedChapters = book.chapters;
  const availableChapters = book.chaptersContent.length;
  const chapterNumbers = book.chaptersContent.map(ch => ch.number).sort((a, b) => a - b);
  
  totalExpectedChapters += expectedChapters;
  totalAvailableChapters += availableChapters;
  
  // Check for discrepancies
  if (expectedChapters !== availableChapters) {
    booksWithIssues.push({
      name: book.name,
      expected: expectedChapters,
      available: availableChapters,
      difference: availableChapters - expectedChapters,
      chapterNumbers: chapterNumbers
    });
  }
  
  // Check for missing chapter numbers
  const missingChapters = [];
  for (let i = 1; i <= expectedChapters; i++) {
    if (!chapterNumbers.includes(i)) {
      missingChapters.push(i);
    }
  }
  
  // Check for extra chapter numbers
  const extraChapters = chapterNumbers.filter(num => num < 1 || num > expectedChapters);
  
  if (missingChapters.length > 0 || extraChapters.length > 0) {
    booksWithIssues.push({
      name: book.name,
      expected: expectedChapters,
      available: availableChapters,
      missing: missingChapters,
      extra: extraChapters,
      chapterNumbers: chapterNumbers
    });
  }
});

console.log(`📊 OVERALL STATISTICS:`);
console.log(`Total Books: ${data.books.length}`);
console.log(`Expected Chapters: ${totalExpectedChapters}`);
console.log(`Available Chapters: ${totalAvailableChapters}`);
console.log(`Difference: ${totalAvailableChapters - totalExpectedChapters}\n`);

console.log(`📚 BOOKS WITH CHAPTER DISCREPANCIES:`);
if (booksWithIssues.length === 0) {
  console.log(`✅ All books have the correct number of chapters!`);
} else {
  booksWithIssues.forEach(book => {
    console.log(`\n📖 ${book.name}:`);
    console.log(`   Expected: ${book.expected} chapters`);
    console.log(`   Available: ${book.available} chapters`);
    
    if (book.difference !== undefined) {
      console.log(`   Difference: ${book.difference > 0 ? '+' : ''}${book.difference}`);
    }
    
    if (book.missing && book.missing.length > 0) {
      console.log(`   Missing chapters: ${book.missing.join(', ')}`);
    }
    
    if (book.extra && book.extra.length > 0) {
      console.log(`   Extra chapters: ${book.extra.join(', ')}`);
    }
    
    console.log(`   Available chapter numbers: ${book.chapterNumbers.join(', ')}`);
  });
}

console.log(`\n🔍 DETAILED BOOK ANALYSIS:`);
data.books.forEach(book => {
  const expectedChapters = book.chapters;
  const availableChapters = book.chaptersContent.length;
  const chapterNumbers = book.chaptersContent.map(ch => ch.number).sort((a, b) => a - b);
  
  const status = expectedChapters === availableChapters ? '✅' : '❌';
  console.log(`${status} ${book.name}: ${availableChapters}/${expectedChapters} chapters`);
  
  if (expectedChapters !== availableChapters) {
    console.log(`   Chapter numbers: ${chapterNumbers.join(', ')}`);
  }
});

console.log(`\n🎯 RECOMMENDATIONS:`);
if (booksWithIssues.length === 0) {
  console.log(`🎉 Perfect! All books have the correct number of chapters.`);
} else {
  console.log(`⚠️  Issues found in ${booksWithIssues.length} books:`);
  booksWithIssues.forEach(book => {
    if (book.difference > 0) {
      console.log(`   • ${book.name}: Remove ${book.difference} extra chapter(s)`);
    } else if (book.difference < 0) {
      console.log(`   • ${book.name}: Add ${Math.abs(book.difference)} missing chapter(s)`);
    }
    
    if (book.missing && book.missing.length > 0) {
      console.log(`   • ${book.name}: Create missing chapters ${book.missing.join(', ')}`);
    }
    
    if (book.extra && book.extra.length > 0) {
      console.log(`   • ${book.name}: Remove extra chapters ${book.extra.join(', ')}`);
    }
  });
}
