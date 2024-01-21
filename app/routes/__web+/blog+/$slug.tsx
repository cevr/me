import { json, type LoaderFunctionArgs, type MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import clsx from "clsx";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { getMDXComponent } from "mdx-bundler/client";
import * as React from "react";
import invariant from "tiny-invariant";

import { ButtonLink, CodeBlock, VerticalSpacer } from "~/components";
import { postsApi } from "~/lib";

dayjs.extend(relativeTime);

export let meta: MetaFunction<typeof loader> = (props) => [{ title: `${props.data?.post.title} | Cristian` }];

export function links() {
  return [
    {
      rel: "stylesheet",
      href: "/code-theme",
    },
  ];
}

export let loader = async ({ params }: LoaderFunctionArgs) => {
  invariant(params.slug, "Missing slug");
  const { newerPost, olderPost, post } = await postsApi.get(params.slug).unwrap();

  if (!post) {
    throw json({ message: "This post doesn't exist." }, { status: 404 });
  }

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
  const { post, newerPost, olderPost } = useLoaderData<typeof loader>();
  const MDXComponent = React.useMemo(() => getMDXComponent(post.content), [post.content]);

  return (
    <div className="text-base font-sans font-light text-neutral-50 leading-[1.9rem] mx-0 my-4">
      <div className="text-neutral-400">
        {dayjs(post.published_at).format("MMMM DD, YYYY")}

        {post.edited_at ? <span className="ml-2 text-[0.5rem] italic">{dayjs().to(post.edited_at)}</span> : null}

        <span> | {post.read_estimate} read</span>
      </div>
      <h1 className="font-bold text-[2.5rem]"> {post.title} </h1>
      <VerticalSpacer size="sm" />
      <div>
        {post.tag_list.map((tag) => (
          <span
            key={tag}
            className="duration-200 mr-2 rounded-lg bg-salmon-600 px-2 py-1 text-neutral-900 transition-all"
          >
            #{tag}
          </span>
        ))}
      </div>
      <VerticalSpacer size="lg" />
      <MDXComponent components={components as any} />
      <VerticalSpacer size="lg" />
      <nav className="flex w-full justify-between">
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
      className={clsx("duration-200 text-neutral-400 transition-colors hover:text-salmon-500", {
        "text-right": newer,
      })}
    >
      <div className="text-xs">{newer ? "Newer →" : "← Older"}</div>
      <Link to={`../${post.slug}`} className="font-bolder text-base md:text-xl">
        {post.title}
      </Link>
    </div>
  );
}

let components = {
  pre: (props: any) => <div className="mx-0 my-2" {...props} />,
  code: (props: any) => <CodeBlock {...props} />,
  a: (props: any) => <ButtonLink {...props} />,
  p: (props: any) => <p className="mx-0 my-4 text-base font-light leading-[1.9rem] text-neutral-50" {...props} />,
  strong: (props: any) => <strong style={{ fontWeight: "bold" }} {...props} />,
  b: (props: any) => <strong style={{ fontWeight: "bold" }} {...props} />,
  h2: (props: any) => <h2 className="text-2xl leading-8" {...props} />,
  // eslint-disable-next-line jsx-a11y/alt-text
  img: (props: any) => <img className="mx-auto my-0" {...props} />,
  blockquote: (props: any) => (
    <blockquote
      className="rounded rounded-bl-none rounded-tl-none border-l-4 border-solid border-l-salmon-500 bg-[#00000030] px-4 py-2 [&>p]:m-0"
      {...props}
    />
  ),
  ol: (props: any) => <ol className="mx-0 my-4 text-base font-light leading-[1.9rem] text-neutral-50" {...props} />,
  li: (props: any) => (
    <li
      className={`ml-4 before:ml-[-1em] before:inline-block before:w-[1em] before:font-bold before:text-salmon-500 before:content-["•"]`}
      {...props}
    />
  ),
};
