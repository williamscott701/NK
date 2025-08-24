import fs from 'fs';

const data = JSON.parse(fs.readFileSync('src/data/bible-books.json', 'utf8'));

console.log('=== REMOVING DUPLICATE CHAPTERS ===\n');

// Books with extra chapters that need fixing
const booksToFix = [
  { id: 'joshua', expectedChapters: 24, name: 'Joshua' },
  { id: 'hosea', expectedChapters: 14, name: 'Hosea' },
  { id: 'john', expectedChapters: 21, name: 'John' },
  { id: 'acts', expectedChapters: 28, name: 'Acts' },
  { id: 'romans', expectedChapters: 16, name: 'Romans' }
];

let totalRemoved = 0;

booksToFix.forEach(bookInfo => {
  const book = data.books.find(b => b.id === bookInfo.id);
  if (!book) {
    console.log(`❌ Book ${bookInfo.name} not found`);
    return;
  }

  console.log(`📖 Processing ${bookInfo.name}...`);
  console.log(`   Expected chapters: ${bookInfo.expectedChapters}`);
  console.log(`   Current chapters: ${book.chaptersContent.length}`);
  
  // Find duplicate chapter numbers
  const chapterNumbers = book.chaptersContent.map(ch => ch.number);
  const duplicates = chapterNumbers.filter((num, index) => chapterNumbers.indexOf(num) !== index);
  
  if (duplicates.length > 0) {
    console.log(`   ❌ Found duplicate chapter numbers: ${duplicates.join(', ')}`);
    
    // Remove duplicate chapters, keeping the first occurrence
    const seen = new Set();
    const originalLength = book.chaptersContent.length;
    
    book.chaptersContent = book.chaptersContent.filter(chapter => {
      if (seen.has(chapter.number)) {
        console.log(`      Removing duplicate Chapter ${chapter.number}: ${chapter.title}`);
        totalRemoved++;
        return false;
      }
      seen.add(chapter.number);
      return true;
    });
    
    console.log(`   ✅ Removed ${originalLength - book.chaptersContent.length} duplicate chapters`);
    console.log(`   📊 Final chapter count: ${book.chaptersContent.length}`);
  } else {
    console.log(`   ✅ No duplicate chapter numbers found`);
  }
  
  // Check if we need to remove extra chapters beyond the expected count
  if (book.chaptersContent.length > bookInfo.expectedChapters) {
    const extra = book.chaptersContent.length - bookInfo.expectedChapters;
    console.log(`   ⚠️  Found ${extra} extra chapters beyond expected count`);
    
    // Remove chapters beyond the expected count (keep first N chapters)
    const chaptersToRemove = book.chaptersContent.slice(bookInfo.expectedChapters);
    chaptersToRemove.forEach(ch => {
      console.log(`      Removing extra Chapter ${ch.number}: ${ch.title}`);
    });
    
    book.chaptersContent = book.chaptersContent.slice(0, bookInfo.expectedChapters);
    totalRemoved += extra;
    console.log(`   ✅ Removed ${extra} extra chapters`);
    console.log(`   📊 Final chapter count: ${book.chaptersContent.length}`);
  }
  
  console.log('');
});

console.log(`=== SUMMARY ===`);
console.log(`Total duplicate/extra chapters removed: ${totalRemoved}`);

// Verify the fix
console.log('\n=== VERIFICATION ===');
booksToFix.forEach(bookInfo => {
  const book = data.books.find(b => b.id === bookInfo.id);
  if (book) {
    const status = book.chaptersContent.length === bookInfo.expectedChapters ? '✅' : '❌';
    console.log(`${status} ${bookInfo.name}: ${book.chaptersContent.length}/${bookInfo.expectedChapters} chapters`);
  }
});

// Save the corrected data
fs.writeFileSync('src/data/bible-books.json', JSON.stringify(data, null, 2));
console.log('\n✅ Updated bible-books.json saved');

console.log('\n=== SCRIPT COMPLETED ===');
console.log('Run "node check_book_chapters.js" to verify the results');
