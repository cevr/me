import { getPosts } from "./blog/blog.server";

const SITE = "https://cvr.im";

export async function loader() {
  const posts = await getPosts();

  const urls = [
    { loc: "/", priority: "1.0" },
    { loc: "/blog", priority: "0.8" },
    ...posts.map((p) => ({
      loc: `/blog/${p.slug}`,
      lastmod: p.date,
      priority: "0.6",
    })),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${SITE}${u.loc}</loc>${
      "lastmod" in u ? `\n    <lastmod>${u.lastmod}</lastmod>` : ""
    }
    <priority>${u.priority}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
