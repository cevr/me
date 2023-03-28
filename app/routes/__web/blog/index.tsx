import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";

import { VerticalSpacer } from "~/components";
import { postsApi } from "~/lib";
import type { Post } from "~/lib/posts.server";

import blogIndexStyles from "../../../styles/blog-index.css";

export let meta: MetaFunction = () => ({
  title: "Blog | Cristian",
});

export function links() {
  return [
    {
      rel: "stylesheet",
      href: blogIndexStyles,
    },
  ];
}

export let loader: LoaderFunction = async () => {
  let posts = await postsApi.query();
  const oneHour = 1000 * 60 * 60;
  return json(
    {
      posts,
    },
    {
      headers: {
        "Cache-Control": `s-maxage=${oneHour}, stale-while-revalidate`,
      },
    },
  );
};

export default function Screen() {
  const data = useLoaderData<{ posts: Post[] }>();
  return (
    <div className="blog">
      <h1>Blog</h1>
      <VerticalSpacer />
      <ul>
        {data.posts.map((post) => (
          <li key={post.slug}>
            <Link to={post.slug}>{post.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
