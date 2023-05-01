import * as React from "react";
import type { LoaderFunction, V2_MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import clsx from "clsx";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { getMDXComponent } from "mdx-bundler/client";

import { ButtonLink, CodeBlock, VerticalSpacer } from "~/components";
import { postsApi } from "~/lib";
import type { Post } from "~/lib/posts.server";

import blogPostStyles from "../../../styles/blog-post.css";

dayjs.extend(relativeTime);

export let meta: V2_MetaFunction = (props) => [{ title: `${props.data?.post.title} | Cristian` }];

export function links() {
  return [
    {
      rel: "stylesheet",
      href: "/code-theme",
    },
    {
      rel: "stylesheet",
      href: blogPostStyles,
    },
  ];
}

export let loader: LoaderFunction = async ({ params }) => {
  let posts = await postsApi.query().unwrap();
  let postIndex = posts.findIndex((post) => post.slug === params?.slug);

  if (postIndex === -1) {
    throw json({ message: "This post doesn't exist." }, { status: 404 });
  }

  let post = posts[postIndex];
  let olderPost = posts[postIndex + 1] ?? null;
  let newerPost = posts[postIndex - 1] ?? null;

  const oneWeek = 1000 * 60 * 60 * 24 * 7;

  return json(
    {
      olderPost,
      newerPost,
      post: {
        ...post,
        content: (await postsApi.serialize({ source: post.matter.content })).code,
      },
    },
    {
      headers: {
        "Cache-Control": `s-maxage=${oneWeek}, stale-while-revalidate`,
      },
    },
  );
};

export default function Screen() {
  const { post, newerPost, olderPost } = useLoaderData<{
    post: Post & {
      content: string;
    };
    newerPost: Post;
    olderPost: Post;
  }>();
  const MDXComponent = React.useMemo(() => getMDXComponent(post.content), [post.content]);

  return (
    <div className="post">
      <div className="date">
        {dayjs(post.published_at).format("MMMM DD, YYYY")}

        {post.edited_at ? <span className="edited">{dayjs().to(post.edited_at)}</span> : null}

        <span> | {post.read_estimate} read</span>
      </div>
      <h1 className="title"> {post.title} </h1>
      <VerticalSpacer size="sm" />
      <div>
        {post.tag_list.map((tag) => (
          <span key={tag} className="blog-tag">
            #{tag}
          </span>
        ))}
      </div>
      <VerticalSpacer size="lg" />
      <MDXComponent components={components as any} />
      <VerticalSpacer size="lg" />
      <nav className="post-nav">
        {olderPost ? <PostNavItem post={olderPost as any} /> : <div />}
        {newerPost ? <PostNavItem post={newerPost as any} newer /> : <div />}
      </nav>
    </div>
  );
}

interface PostNavItemProps {
  post: postsApi.Post;
  newer?: boolean;
}

function PostNavItem({ post, newer }: PostNavItemProps) {
  return (
    <div
      className={clsx("post-nav-item", {
        newer: newer,
      })}
    >
      <div className="post-nav-item-date">{newer ? "Newer →" : "← Older"}</div>
      <Link to={`../${post.slug}`} className="post-nav-item-title">
        {post.title}
      </Link>
    </div>
  );
}

let components = {
  pre: (props: any) => <div className="code" {...props} />,
  code: (props: any) => <CodeBlock {...props} />,
  a: (props: any) => <ButtonLink {...props} />,
  p: (props: any) => <p className="paragraph" {...props} />,
  strong: (props: any) => <strong style={{ fontWeight: "bold" }} {...props} />,
  b: (props: any) => <strong style={{ fontWeight: "bold" }} {...props} />,
  h2: (props: any) => <h2 className="subtitle" {...props} />,
  // eslint-disable-next-line jsx-a11y/alt-text
  img: (props: any) => <img className="image" {...props} />,
  blockquote: (props: any) => <blockquote className="blockquote" {...props} />,
};
