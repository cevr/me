import Head from "next/head";
import Link from "next/link";

import { postsApi } from "@api/index";
import { VerticalSpacer } from "@components/index";
import { BlogLayout } from "@layouts/index";
import styles from "./blog.module.css";

interface BlogProps {
  posts: postsApi.Post[];
}

function Blog({ posts }: BlogProps) {
  return (
    <BlogLayout className={styles.blog}>
      <Head>
        <title>Blog | Cristian</title>
      </Head>
      <h1>Blog</h1>
      <VerticalSpacer />
      <ul>
        {posts.map((post) => (
          <li key={post.slug}>
            <Link as={`/blog/${post.slug}`} href="/blog/[slug]">
              <a>{post.title}</a>
            </Link>
          </li>
        ))}
      </ul>
    </BlogLayout>
  );
}

export default Blog;

export async function getStaticProps() {
  let posts = await postsApi.query();
  return {
    props: {
      posts,
    },
    revalidate: 1,
  };
}
