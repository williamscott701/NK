import type { APIRoute } from 'astro';
import booksData from '../data/bible-books.json';
import conceptsData from '../data/bible-concepts.json';
import storiesData from '../data/bible-stories.json';

export const GET: APIRoute = async () => {
  const baseUrl = 'https://biblebing.com';
  
  // Static pages
  const staticPages = [
    '',
    '/books',
    '/concepts', 
    '/stories'
  ];

  // Generate book pages
  const bookPages = booksData.books.map(book => `/book/${book.id}`);
  
  // Generate chapter pages for each book
  const chapterPages = booksData.books.flatMap(book => 
    book.chaptersContent ? book.chaptersContent.map(chapter => `/book/${book.id}/chapter/${chapter.number}`) : []
  );

  // Generate concept pages
  const conceptPages = conceptsData.concepts.map(concept => `/concept/${concept.id}`);

  // Generate story pages
  const storyPages = storiesData.stories.map(story => `/story/${story.id}`);

  // Combine all URLs
  const allUrls = [
    ...staticPages,
    ...bookPages,
    ...chapterPages,
    ...conceptPages,
    ...storyPages
  ];

  // Generate sitemap XML
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.map(url => `  <url>
    <loc>${baseUrl}${url}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${url === '' ? '1.0' : url.includes('/chapter/') ? '0.6' : '0.8'}</priority>
  </url>`).join('\n')}
</urlset>`;

  return new Response(sitemap, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml'
    }
  });
};
