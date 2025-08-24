import fs from 'fs';

const data = JSON.parse(fs.readFileSync('src/data/bible-books.json', 'utf8'));

console.log('=== COMPREHENSIVE BIBLE COMPLETION ANALYSIS ===\n');

let totalChapters = 0;
let totalCompleted = 0;
let fullyCompletedBooks = 0;
let partiallyCompletedBooks = 0;
let booksWithMissingChapters = [];

data.books.forEach(book => {
  const chaptersWithContent = book.chaptersContent.filter(ch =>
    ch.title && ch.summary && ch.keyVerses && ch.content && ch.themes
  ).length;

  totalChapters += book.chapters;
  totalCompleted += chaptersWithContent;

  if (chaptersWithContent === book.chapters) {
    fullyCompletedBooks++;
  } else {
    partiallyCompletedBooks++;
    
    // Find specific missing chapters
    const missingChapters = [];
    for (let i = 1; i <= book.chapters; i++) {
      const chapter = book.chaptersContent.find(ch => ch.number === i);
      if (!chapter || !chapter.title || !chapter.summary || !chapter.keyVerses || !chapter.content || !chapter.themes) {
        missingChapters.push(i);
      }
    }
    
    booksWithMissingChapters.push({
      name: book.name,
      completed: chaptersWithContent,
      total: book.chapters,
      missing: missingChapters
    });
  }
});

console.log(`📊 OVERALL STATUS:`);
console.log(`Total Chapters: ${totalChapters}`);
console.log(`Completed Chapters: ${totalCompleted}`);
console.log(`Completion Rate: ${((totalCompleted / totalChapters) * 100).toFixed(1)}%`);
console.log(`Fully Completed Books: ${fullyCompletedBooks}/${data.books.length}`);
console.log(`Partially Completed Books: ${partiallyCompletedBooks}/${data.books.length}\n`);

console.log(`📚 BOOKS WITH MISSING CHAPTERS:`);
booksWithMissingChapters.forEach(book => {
  console.log(`${book.name} (${book.completed}/${book.total}) - Missing: chapters ${book.missing.join(', ')}`);
});

console.log(`\n🎯 PRIORITY ORDER (by missing chapters):`);
booksWithMissingChapters
  .sort((a, b) => a.missing.length - b.missing.length)
  .forEach((book, index) => {
    console.log(`${index + 1}. ${book.name} - ${book.missing.length} chapters missing`);
  });
