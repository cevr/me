import { Link, data } from "react-router";
import type { Route } from "./+types/post";
import { getPost } from "./blog.server";
import { Landscape } from "~/components/landscape";
import { useTheme } from "~/lib/theme";

export async function loader({ params }: Route.LoaderArgs) {
  const post = await getPost(params.slug);
  if (!post) throw data("Not found", { status: 404 });
  return { post };
}

export default function Post({ loaderData }: Route.ComponentProps) {
  const { post } = loaderData;
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="relative flex min-h-dvh flex-col items-center px-6 pt-24 pb-16">
      <Landscape />

      <main className="relative w-full max-w-[60ch]">
        <header className="flex items-center justify-between">
          <Link
            to="/blog"
            className="font-mono text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            &larr; writing
          </Link>
          <button
            onClick={toggleTheme}
            className="cursor-pointer font-mono text-sm text-muted-foreground transition-colors hover:text-foreground"
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            {theme === "dark" ? "light" : "dark"}
          </button>
        </header>

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
      </main>
    </div>
  );
}
