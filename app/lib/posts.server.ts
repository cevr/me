import { cachified } from '@epic-web/cachified';
import { Task } from 'ftld';
import type { AsyncTask } from 'ftld';
import matter from 'gray-matter';
import { LRUCache } from 'lru-cache';
import { request } from 'undici';

import { DomainError } from './domain-error';
import { env } from './env.server';

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
  return `${Math.ceil(time)} minutes`;
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

type FetchArticleError = DomainError<'FetchArticleError'>;
const FetchArticleError = DomainError.make('FetchArticleError');

let fetchArticle = (page: number): AsyncTask<FetchArticleError, Post[]> =>
  Task.from(
    () =>
      request(
        `https://dev.to/api/articles/me/published?page=${page}&per_page=100`,
        {
          headers: {
            'api-key': env.DEV_TO_TOKEN,
            'user-agent': 'cvr.im',
          },
        },
      ).then((res) => {
        return res.body.json();
      }) as Promise<Post[]>,
    (e) => FetchArticleError({ message: 'Could not fetch articles', meta: e }),
  );

let fetchAllArticles = (
  page = 1,
  results: Post[] = [],
): AsyncTask<FetchArticleError, Post[]> => {
  return fetchArticle(page).flatMap((latestResults) => {
    if (latestResults.length === 100)
      return fetchAllArticles(page + 1, results.concat(latestResults));

    return Task.AsyncOk(results.concat(latestResults));
  });
};

let cache = new LRUCache<string, Post[]>({ max: 100 });

export let all = (): AsyncTask<FetchArticleError, Post[]> => {
  return Task.from(() =>
    cachified({
      cache: cache as any,
      key: 'posts',
      getFreshValue: () =>
        fetchAllArticles()
          .map((posts) => posts.map(normalizePost))
          .run(),
    }),
  );
};

interface PostBySlug {
  post: Post | undefined;
  olderPost: Post | undefined;
  newerPost: Post | undefined;
}

export let get = (slug: string): AsyncTask<FetchArticleError, PostBySlug> => {
  return Task.from(() =>
    cachified({
      cache: cache as any,
      key: `post-${slug}`,
      getFreshValue: () =>
        all().map((posts) => {
          let postIndex = posts.findIndex((post) => post.slug === slug);
          let post = posts[postIndex] as Post | undefined;
          let olderPost = posts[postIndex + 1] as Post | undefined;
          let newerPost = posts[postIndex - 1] as Post | undefined;
          return { post, olderPost, newerPost };
        }),
    }),
  );
};

export { bundleMDX as serialize } from 'mdx-bundler';
