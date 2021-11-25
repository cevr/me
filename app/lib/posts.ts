import matter from 'gray-matter';

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
  read_estimate: string;
}

let stripWhitespace = (string: string) => {
  return string.replace(/^\s+/, '').replace(/\s+$/, '');
};

let wordCount = (string: string) => {
  let pattern = '\\w+';
  let reg = new RegExp(pattern, 'g');
  return (string.match(reg) || []).length;
};

let humanReadableTime = (time: number) => {
  if (time < 1) {
    return 'less than a minute';
  }
  return `${Math.ceil(time)} minute`;
};

let getReadEstimate = (content: string) => {
  let avergageWordsPerMinute = 225;
  content = stripWhitespace(content);
  let minutes = wordCount(content) / avergageWordsPerMinute;
  return humanReadableTime(minutes);
};

let normalizePost = (post: Post): Post => {
  let { data, content } = matter(post.body_markdown);
  return {
    ...post,
    // remove the last bit (its a 4 digit identifier, not needed here)
    slug: post.slug.split('-').slice(0, -1).join('-'),
    matter: { data, content },
    read_estimate: getReadEstimate(post.body_markdown),
  };
};

let fetchArticle = async (page: number): Promise<Post[]> =>
  fetch(`https://dev.to/api/articles/me/published?page=${page}&per_page=100`, {
    headers: {
      'api-key': process.env.DEV_TO_TOKEN as string,
    },
  })
    .then((res) => {
      if (res.status !== 200) {
        return Promise.reject(res.statusText);
      }
      return res.json() as Promise<Post[]>;
    })
    .catch((err) => {
      throw new Error(`error fetching page ${page}, ${err}`);
    });

let fetchAllArticles = async (
  page = 1,
  results: Post[] = []
): Promise<Post[]> => {
  let latestResults = await fetchArticle(page);

  if (latestResults.length === 100)
    return fetchAllArticles(page + 1, results.concat(latestResults));

  return results.concat(latestResults);
};

export let query = async () => {
  let posts = (await fetchAllArticles()).map(normalizePost);
  return posts;
};
