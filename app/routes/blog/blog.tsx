import { Link } from "react-router";
import type { Route } from "./+types/blog";
import { getPosts } from "./blog.server";
import { Landscape } from "~/components/landscape";
import { useTheme } from "~/lib/theme";

export async function loader() {
  const posts = await getPosts();
  return { posts };
}

export default function Blog({ loaderData }: Route.ComponentProps) {
  const { posts } = loaderData;
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="relative flex min-h-dvh flex-col items-center px-6 pt-24 pb-16">
      <Landscape />

      <main className="relative w-full max-w-[60ch]">
        <header className="flex items-center justify-between">
          <Link
            to="/"
            className="font-mono text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            &larr; home
          </Link>
          <button
            onClick={toggleTheme}
            className="cursor-pointer font-mono text-sm text-muted-foreground transition-colors hover:text-foreground"
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            {theme === "dark" ? "light" : "dark"}
          </button>
        </header>

        <h1 className="mt-10 text-2xl font-medium tracking-tight">writing</h1>

        {posts.length === 0 ? (
          <p className="mt-6 text-muted-foreground">nothing yet.</p>
        ) : (
          <ul className="mt-6 space-y-4">
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
      </main>
    </div>
  );
}
