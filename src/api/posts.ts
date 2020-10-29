import matter from "gray-matter";
import makeFetch from "make-fetch-happen";

const fetch = makeFetch.defaults({
  cacheManager: "./cache",
});

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

let normalizePost = (post: Post): Post => {
  const { data, content } = matter(post.body_markdown);
  return {
    ...post,
    slug: post.slug.split("-").slice(0, -1).join("-"),
    matter: { data, content },
  };
};

export let query = async () => {
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
          "api-key": process.env.dev_token as any,
        },
      }
    )
      .then((res) => {
        return res.json();
      })
      .then((x) => (posts = posts.concat(x)))
      .catch((err) => {
        throw new Error(`error fetching page ${page}, ${JSON.stringify(err)}`);
      });
  } while (latestResult.length === per_page);
  return posts.map(normalizePost);
};
