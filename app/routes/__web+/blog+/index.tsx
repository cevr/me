import { json, type LoaderFunction, type MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";

import { VerticalSpacer } from "~/components";
import { postsApi } from "~/lib";
import type { Post } from "~/lib/posts.server";

export let meta: MetaFunction = () => [
  {
    title: "Blog | Cristian",
  },
];

export let loader: LoaderFunction = async () => {
  let posts = (await postsApi.all()).unwrap();
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
    <>
      <h1 className="text-5xl">Blog</h1>
      <VerticalSpacer />
      <ul className="flex flex-col gap-4 font-light">
        {data.posts.map((post) => (
          <li className="text-xl text-neutral-50 duration-200 hover:text-salmon-500" key={post.slug}>
            <Link to={post.slug}>{post.title}</Link>
          </li>
        ))}
      </ul>
    </>
  );
}
