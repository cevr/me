import { data } from "react-router";
import type { Route } from "./+types/post";
import { getPost } from "./blog.server";
import { PageLayout } from "~/components/page-layout";

export async function loader({ params }: Route.LoaderArgs) {
  const post = await getPost(params.slug);
  if (!post) throw data("Not found", { status: 404 });
  return { post };
}

export default function Post({ loaderData }: Route.ComponentProps) {
  const { post } = loaderData;

  return (
    <PageLayout nav={{ to: "/blog", label: "← writing" }}>
      <article className="mt-10">
        <h1 className="text-2xl font-medium tracking-tight">{post.title}</h1>
        <time
          dateTime={post.date}
          className="mt-2 block font-mono text-xs text-muted-foreground"
        >
          {new Intl.DateTimeFormat("en", {
            month: "long",
            day: "numeric",
            year: "numeric",
          }).format(new Date(post.date))}
        </time>

        <div
          className="prose mt-8"
          dangerouslySetInnerHTML={{ __html: post.html }}
        />
      </article>
    </PageLayout>
  );
}
