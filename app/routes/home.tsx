import type { Route } from "./+types/home";

export const handle = {
  static: true,
};

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Cristian Ramos | Product Engineer" },
    {
      name: "description",
      content: "Product engineer, technologist, and builder.",
    },
  ];
}

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col p-8 md:p-16 dark:bg-zinc-950 bg-zinc-50 font-mono gap-16">
      <main className="flex-1 max-w-2xl mx-auto flex flex-col justify-center">
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
            <div className="flex flex-col gap-6">
              {[
                { name: "GitHub", href: "https://github.com/cevr" },
                { name: "X", href: "https://x.com/_cristianvr_" },
                {
                  name: "LinkedIn",
                  href: "https://linkedin.com/in/cristianvr",
                },
                {
                  name: "Email",
                  href: "mailto:hello@cvr.im?subject=Hi Cristian!",
                },
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

      <footer className="text-center text-xs text-zinc-500 dark:text-zinc-600">
        © {new Date().getFullYear()}
      </footer>
    </div>
  );
}
