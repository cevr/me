import type { Config } from "@react-router/dev/config";
import fs from "node:fs/promises";
import path from "node:path";

export default {
  ssr: true,
  appDirectory: "app",
  async prerender() {
    const postsDir = path.join(process.cwd(), "content/posts");
    let slugs: string[] = [];
    try {
      const files = await fs.readdir(postsDir);
      slugs = files
        .filter((f) => f.endsWith(".md"))
        .map((f) => f.replace(/\.md$/, ""));
    } catch {
      // no posts yet
    }

    return [
      "/",
      "/blog",
      ...slugs.map((s) => `/blog/${s}`),
      "/sitemap.xml",
      "/blog/rss.xml",
    ];
  },
} satisfies Config;
