import { json, type MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { cacheHeader } from "pretty-cache-header";

import { VerticalSpacer } from "~/components";
import { postsApi } from "~/lib";

export let meta: MetaFunction = () => [
  {
    title: "Blog | Cristian",
  },
];

export let loader = async () => {
  let posts = await postsApi.all().unwrap();
  return json(
    {
      posts,
    },
    {
      headers: {
        "Cache-Control": cacheHeader({
          public: true,
          maxAge: "1week",
          staleWhileRevalidate: "1year",
        }),
      },
    },
  );
};

export default function Screen() {
  const data = useLoaderData<typeof loader>();
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
