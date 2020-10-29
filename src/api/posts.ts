import matter from "gray-matter";
import fs from "fs";
import path from "path";
import { addSeconds, isAfter } from "date-fns";

type Maybe<T> = T | null;

export interface Post {
  type_of: string;
  id: number;
  title: string;
  description: string;
  published: boolean;
  published_at: string;
  slug: string;
  path: string;
  url: string;
  comments_count: number;
  public_reactions_count: number;
  page_views_count: number;
  published_timestamp: string;
  body_markdown: string;
  cover_image: Maybe<string>;
  positive_reactions_count: number;
  readable_publish_date: string;
  social_image: string;
  tag_list: string[];
  canonical_url: string;
  created_at: string;
  edited_at: Maybe<string>;
  crossposted_at: Maybe<string>;
  last_comment_at: string;
  content: string;
  matter: { data: Record<string, any>; content: string };
}

let cachePath = path.join(process.cwd(), "cache");
let cacheValuePath = path.join(cachePath, "value");
let cacheTtlPath = path.join(cachePath, "ttl");

let cache = {
  set: (value: any) => {
    if (!fs.existsSync(cachePath)) fs.mkdirSync(cachePath);
    let revalidate = addSeconds(new Date(), 1).getTime();
    fs.writeFileSync(cacheValuePath, JSON.stringify(value));
    fs.writeFileSync(cacheTtlPath, JSON.stringify(revalidate));
  },
  get: <T>(): T | null => {
    if (!fs.existsSync(cacheValuePath) || !fs.existsSync(cacheTtlPath)) {
      return null;
    }
    const ttl = JSON.parse(fs.readFileSync(cacheTtlPath).toString());
    const now = Date.now();
    const shouldRevalidate = isAfter(now, ttl);
    return shouldRevalidate
      ? null
      : JSON.parse(fs.readFileSync(cacheValuePath).toString());
  },
};

let normalizePost = (post: Post): Post => {
  const { data, content } = matter(post.body_markdown);
  return {
    ...post,
    // remove the last bit (its a 4 digit identifier, not needed here)
    slug: post.slug.split("-").slice(0, -1).join("-"),
    matter: { data, content },
  };
};

export let query = async () => {
  // we cache the response
  // otherwise we'll hit the 429 error "Too many requests" during build times
  let cached = cache.get<Post[]>();
  if (cached) return cached;

  let posts: Post[] = [];
  let page = 0;
  let per_page = 30; // can go up to 1000
  let latestResult = [];

  do {
    page += 1; // bump page up by 1 every loop
    latestResult = await fetch(
      `https://dev.to/api/articles/me/published?page=${page}&per_page=${per_page}`,
      {
        headers: {
          "api-key": process.env.dev_token as string,
        },
      }
    )
      .then((res) =>
        res.status !== 200 ? Promise.reject(res.statusText) : res.json()
      )
      .then((x) => (posts = posts.concat(x)))
      .catch((err) => {
        throw new Error(`error fetching page ${page}, ${err}`);
      });
  } while (latestResult.length === per_page);
  posts = posts.map(normalizePost);
  cache.set(posts);
  return posts;
};
