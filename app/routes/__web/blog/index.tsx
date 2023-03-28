import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";

import { VerticalSpacer } from "~/components";
import { postsApi } from "~/lib";
import type { Post } from "~/lib/posts.server";

export let meta: MetaFunction = () => ({
  title: "Blog | Cristian",
});

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
    <div>
      <h1 className="text-5xl">Blog</h1>
      <VerticalSpacer />
      <ul className="flex flex-col gap-4">
        {data.posts.map((post) => (
          <li className="text-xl text-[var(--fg)] duration-200 hover:text-[var(--highlight)]" key={post.slug}>
            <Link to={post.slug}>{post.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
