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

const oneWeek = 1000 * 60 * 60 * 24 * 7;
export let loader: LoaderFunction = async () => {
  let posts = await postsApi.all().unwrap();
  return json(
    {
      posts,
    },
    {
      headers: {
        "Cache-Control": `public, max-age=${oneWeek}`,
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
