import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import renderToString from "next-mdx-remote/render-to-string";
import hydrate from "next-mdx-remote/hydrate";
import { format, formatDistanceToNow } from "date-fns";
import clsx from "clsx";

import {
  ButtonLink,
  CodeBlock,
  KaizenLoading,
  VerticalSpacer,
} from "@components/index";
import { postsApi } from "@api/index";
import { BlogLayout } from "@layouts/index";
import styles from "./post.module.css";

let components = {
  code: CodeBlock,
  pre: (props: any) => <div className={styles.code} {...props} />,
  a: (props: any) => <ButtonLink {...props} />,
  p: (props: any) => <p className={styles.paragraph} {...props} />,
  strong: (props: any) => <strong style={{ fontWeight: "bold" }} {...props} />,
  b: (props: any) => <strong style={{ fontWeight: "bold" }} {...props} />,
  h2: (props: any) => <h2 className={styles.subtitle} {...props} />,
  img: (props: any) => <Image unsized className={styles.image} {...props} />,
  blockquote: (props: any) => (
    <blockquote className={styles.blockquote} {...props} />
  ),
};

interface PostProps {
  post: postsApi.Post;
  newerPost: postsApi.Post | null;
  olderPost: postsApi.Post | null;
}

function Post({ post, newerPost, olderPost }: PostProps) {
  let router = useRouter();

  if (router.isFallback) {
    return (
      <BlogLayout>
        <KaizenLoading />
      </BlogLayout>
    );
  }

  let content = hydrate(post.content, { components });
  return (
    <BlogLayout>
      <Head>
        <title> {`${post.title} | Cristian`} </title>
      </Head>
      <div className={styles.date}>
        {format(new Date(post.published_at), "MMMM d, y")}

        {post.edited_at ? (
          <span className={styles.edited}>
            {formatDistanceToNow(new Date(post.edited_at))}
          </span>
        ) : null}

        <span> | {post.read_estimate} read</span>
      </div>
      <h1 className={styles.title}> {post.title} </h1>
      <VerticalSpacer size="sm" />
      <div>
        {post.tag_list.map((tag) => (
          <span key={tag} className={styles.tag}>
            #{tag}
          </span>
        ))}
      </div>
      <VerticalSpacer size="lg" />
      {content}
      <VerticalSpacer size="lg" />
      <nav className={styles["post-nav"]}>
        {olderPost ? <PostNavItem post={olderPost} /> : <div />}
        {newerPost ? <PostNavItem post={newerPost} newer /> : <div />}
      </nav>
    </BlogLayout>
  );
}

export default Post;

interface PostNavItemProps {
  post: postsApi.Post;
  newer?: boolean;
}

function PostNavItem({ post, newer }: PostNavItemProps) {
  return (
    <div className={styles["post-nav-item"]}>
      <div
        className={clsx(styles["post-nav-item-date"], {
          [styles.newer]: newer,
        })}
      >
        {newer ? "Newer →" : "← Older"}
      </div>
      <Link as={`/blog/${post.slug}`} href="/blog/[slug]">
        <a className={styles["post-nav-item-title"]}> {post.title} </a>
      </Link>
    </div>
  );
}

export let getStaticProps: GetStaticProps = async ({ params }) => {
  let posts = await postsApi.query();
  let postIndex = posts.findIndex((post) => post.slug === params?.slug);

  let post = posts[postIndex];

  let olderPost = (() => {
    let newIndex = postIndex + 1;
    let isWithinPosts = newIndex <= posts.length - 1;
    return isWithinPosts ? posts[newIndex] : null;
  })();

  let newerPost = (() => {
    let newIndex = postIndex - 1;
    let isWithinPosts = newIndex >= 0;
    return isWithinPosts ? posts[newIndex] : null;
  })();

  return {
    props: {
      olderPost,
      newerPost,
      post: post
        ? {
            ...post,
            content: await renderToString(post.matter.content, { components }),
          }
        : null,
    },
    revalidate: 1,
  };
};

export let getStaticPaths: GetStaticPaths = async () => {
  let posts = await postsApi.query();

  return {
    paths: posts.map((post) => ({
      params: {
        slug: post.slug,
      },
    })),
    fallback: true,
  };
};
