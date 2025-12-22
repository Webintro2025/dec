// src/app/sitemap.xml/route.js
import { locations } from "@/marketplace";


export async function GET() {
  // List your static pages
  const staticPages = [
     
    'sitemap',
  ];



  // Dynamic location URLs for /in/[slug]
  const dynamicLocations = locations.map((loc) => {
    const slug = loc
      .toString()
      .toLowerCase()
      .replace(/[^\u0000-\u007F]/g, "") // remove non-ascii (optional)
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
    return `bamboo-light-manufactures-in/${slug}`;
  });

  const baseUrl = 'https://ekotique.com/';

  const urls = [
    ...staticPages.map((page) => `${baseUrl}${page}`),
  
    ...dynamicLocations.map((loc) => `${baseUrl}${loc}`),
  
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls
    .map(
      (url) => `    <url>\n      <loc>${url}</loc>\n      <changefreq>weekly</changefreq>\n      <priority>0.8</priority>\n    </url>`
    )
    .join('\n')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
