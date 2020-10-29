import Head from "next/head";
import Link from "next/link";
import { postsApi } from "../api";
import { VerticalSpacer } from "../components";
import { BlogLayout } from "../layouts";
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

export function getStaticProps() {
  return {
    props: {
      posts: postsApi.getAllPosts(),
    },
    revalidate: 600,
  };
}
