import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  description?: string;
}

export interface Post extends PostMeta {
  html: string;
}

const POSTS_DIR = path.join(import.meta.dirname, "posts");

export async function getPosts(): Promise<PostMeta[]> {
  const files = await fs.readdir(POSTS_DIR);
  const posts = await Promise.all(
    files
      .filter((f) => f.endsWith(".md"))
      .map(async (filename) => {
        const slug = filename.replace(/\.md$/, "");
        const raw = await fs.readFile(path.join(POSTS_DIR, filename), "utf-8");
        const { data } = matter(raw);
        return {
          slug,
          title: data.title as string,
          date: data.date as string,
          description: data.description as string | undefined,
        };
      }),
  );

  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}

export async function getPost(slug: string): Promise<Post | null> {
  const filepath = path.join(POSTS_DIR, `${slug}.md`);
  try {
    const raw = await fs.readFile(filepath, "utf-8");
    const { data, content } = matter(raw);
    const html = await marked(content);
    return {
      slug,
      title: data.title as string,
      date: data.date as string,
      description: data.description as string | undefined,
      html,
    };
  } catch {
    return null;
  }
}
