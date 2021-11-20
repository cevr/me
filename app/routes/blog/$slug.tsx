import { MetaFunction, LoaderFunction, useLoaderData, Link, json } from "remix";
import clsx from "clsx";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { serialize } from "next-mdx-remote/serialize";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";

import { ButtonLink, CodeBlock, VerticalSpacer } from "~/components";
import { postsApi } from "~/lib";
import { Post } from "~/lib/posts";

import blogPostStyles from "../../styles/blog-post.css";

dayjs.extend(relativeTime);

export let meta: MetaFunction = (props) => {
  return {
    title: `${props.data.title} | Cristian`,
  };
};

export function links() {
  return [
    {
      rel: "stylesheet",
      href: blogPostStyles,
    },
  ];
}

export let loader: LoaderFunction = async ({ params }) => {
  let posts = await postsApi.query();
  let postIndex = posts.findIndex((post) => post.slug === params?.slug);

  if (postIndex === -1) {
    throw json({ message: "This post doesn't exist." }, { status: 404 });
  }

  let post = posts[postIndex];
  let olderPost = posts[postIndex + 1] ?? null;
  let newerPost = posts[postIndex - 1] ?? null;

  return {
    olderPost,
    newerPost,
    post: {
      ...post,
      content: await serialize(post.matter.content),
    },
  };
};

export default function Screen() {
  const { post, newerPost, olderPost } = useLoaderData<{
    post: Post & {
      content: MDXRemoteSerializeResult;
    };
    newerPost: Post;
    olderPost: Post;
  }>();

  return (
    <div className="post">
      <div className="date">
        {dayjs(post.published_at, "MMMM d, y")}

        {post.edited_at ? (
          <span className="edited">{dayjs().to(post.edited_at)}</span>
        ) : null}

        <span> | {post.read_estimate} read</span>
      </div>
      <h1 className="title"> {post.title} </h1>
      <VerticalSpacer size="sm" />
      <div>
        {post.tag_list.map((tag) => (
          <span key={tag} className="tag">
            #{tag}
          </span>
        ))}
      </div>
      <VerticalSpacer size="lg" />
      <MDXRemote {...post.content} components={components} />
      <VerticalSpacer size="lg" />
      <nav className="post-nav">
        {olderPost ? <PostNavItem post={olderPost} /> : <div />}
        {newerPost ? <PostNavItem post={newerPost} newer /> : <div />}
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
      <Link to={post.slug} className="post-nav-item-title">
        {post.title}
      </Link>
    </div>
  );
}

let components = {
  code: CodeBlock,
  pre: (props: any) => <div className="code" {...props} />,
  a: (props: any) => <ButtonLink {...props} />,
  p: (props: any) => <p className="paragraph" {...props} />,
  strong: (props: any) => <strong style={{ fontWeight: "bold" }} {...props} />,
  b: (props: any) => <strong style={{ fontWeight: "bold" }} {...props} />,
  h2: (props: any) => <h2 className="subtitle" {...props} />,
  img: (props: any) => <img className="image" {...props} />,
  blockquote: (props: any) => <blockquote className="blockquote" {...props} />,
};
