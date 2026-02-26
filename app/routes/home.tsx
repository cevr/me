import { Landscape } from "~/components/landscape";
import { useTheme } from "~/lib/theme";

export default function Home() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center px-6">
      <Landscape />

      <main className="relative w-full max-w-sm">
        <h1 className="text-2xl font-medium tracking-tight">cristian</h1>

        <p className="mt-3 leading-relaxed text-muted-foreground">
          building things with care.
        </p>

        <nav
          className="mt-6 flex gap-4 font-mono text-sm"
          aria-label="Social links"
        >
          <a
            href="https://github.com/cevr"
            className="text-muted-foreground transition-colors hover:text-foreground"
            target="_blank"
            rel="noopener noreferrer"
          >
            github
          </a>
          <span className="text-border" aria-hidden>
            /
          </span>
          <a
            href="https://x.com/_cristianvr_"
            className="text-muted-foreground transition-colors hover:text-foreground"
            target="_blank"
            rel="noopener noreferrer"
          >
            x
          </a>
          <span className="text-border" aria-hidden>
            /
          </span>
          <a
            href="mailto:hello@cvr.im"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            email
          </a>
        </nav>

        <div className="mt-10 flex items-center justify-between">
          <a
            href="/blog"
            className="font-mono text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            writing &rarr;
          </a>

          <button
            onClick={toggleTheme}
            className="cursor-pointer font-mono text-sm text-muted-foreground transition-colors hover:text-foreground"
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            {theme === "dark" ? "light" : "dark"}
          </button>
        </div>
      </main>
    </div>
  );
}
