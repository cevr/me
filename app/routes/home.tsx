import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col p-8 md:p-16 dark:bg-zinc-950 bg-zinc-50">
      <header className="flex justify-between items-center mb-12 md:mb-24">
        {/* <Signature className="w-16 md:w-20" /> */}
        {/* <ModeToggle /> */}
      </header>

      <main className="flex-1 max-w-2xl mx-auto w-full">
        <div className="flex flex-col gap-16">
          <div>
            <h1 className="text-4xl md:text-5xl font-light mb-8 dark:text-white text-zinc-900 tracking-tight">
              Cristian.
            </h1>
            <div className="space-y-6 text-lg dark:text-zinc-300 text-zinc-700 leading-relaxed">
              <p>Product engineer, technologist, and builder.</p>
              <p>
                Creating meaningful digital experiences that combine thoughtful
                design with powerful technology.
              </p>
              <p>
                Currently exploring the intersection of AI and human creativity,
                building tools that augment our capabilities.
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-medium mb-6 dark:text-white text-zinc-900 tracking-tight">
              Find me
            </h2>
            <div className="flex flex-wrap gap-6">
              {[
                { name: "GitHub", href: "https://github.com" },
                { name: "X", href: "https://x.com" },
                { name: "LinkedIn", href: "https://linkedin.com" },
                { name: "Email", href: "mailto:hello@example.com" },
              ].map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline transition-colors font-mono"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-32 text-center text-xs text-zinc-500 dark:text-zinc-600">
        © {new Date().getFullYear()}
      </footer>
    </div>
  );
}
