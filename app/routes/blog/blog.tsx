import { Link } from "react-router";
import type { Route } from "./+types/blog";
import { getPosts } from "./blog.server";
import { PageLayout } from "~/components/page-layout";

export const meta: Route.MetaFunction = () => [
  { title: "writing — cristian" },
  { name: "description", content: "Thoughts on building things with care." },
  { property: "og:url", content: "https://cvr.im/blog" },
  { tagName: "link", rel: "canonical", href: "https://cvr.im/blog" },
];

export async function loader() {
  const posts = await getPosts();
  return { posts };
}

export default function Blog({ loaderData }: Route.ComponentProps) {
  const { posts } = loaderData;

  return (
    <PageLayout nav={{ to: "/", label: "← home" }}>
      <h1 className="mt-10 text-2xl font-medium tracking-tight">writing</h1>

      {posts.length === 0 ? (
        <p className="mt-6 text-muted-foreground">nothing yet.</p>
      ) : (
        <ul className="mt-6 space-y-5">
          {posts.map((post) => (
            <li key={post.slug}>
              <Link
                to={`/blog/${post.slug}`}
                className="group flex items-baseline justify-between gap-4"
              >
                <span className="text-foreground transition-colors group-hover:text-primary">
                  {post.title}
                </span>
                <time
                  dateTime={post.date}
                  className="shrink-0 font-mono text-xs text-muted-foreground"
                >
                  {new Intl.DateTimeFormat("en", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  }).format(new Date(post.date))}
                </time>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </PageLayout>
  );
}
