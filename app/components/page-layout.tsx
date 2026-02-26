import { Link } from "react-router";
import { Landscape } from "~/components/landscape";
import { useTheme } from "~/lib/theme";

interface PageLayoutProps {
  nav: { to: string; label: string };
  children: React.ReactNode;
}

export function PageLayout({ nav, children }: PageLayoutProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="relative flex min-h-dvh flex-col items-center px-6 pt-28 pb-16 sm:pt-40">
      <Landscape />

      <main className="relative w-full max-w-[60ch]">
        <header className="-mx-2 flex items-center justify-between">
          <Link
            to={nav.to}
            className="rounded-md px-2 py-2 font-mono text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            {nav.label}
          </Link>
          <button
            onClick={toggleTheme}
            className="cursor-pointer rounded-md px-2 py-2 font-mono text-sm text-muted-foreground transition-colors hover:text-foreground"
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            {theme === "dark" ? "light" : "dark"}
          </button>
        </header>

        {children}
      </main>
    </div>
  );
}
