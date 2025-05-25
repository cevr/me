import type { Route } from './+types/home';

export const handle = {
  static: true,
};

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Cristian Ramos | Product Engineer' },
    {
      name: 'description',
      content: 'Product engineer, technologist, and builder.',
    },
  ];
}

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col gap-16 bg-zinc-50 p-8 font-mono md:p-16 dark:bg-zinc-950">
      <main className="mx-auto flex max-w-2xl flex-1 flex-col justify-center">
        <div className="flex flex-col gap-16">
          <div>
            <h1 className="mb-8 text-4xl font-light tracking-tight text-zinc-900 md:text-5xl dark:text-white">
              Cristian.
            </h1>
            <div className="space-y-6 text-lg leading-relaxed text-zinc-700 dark:text-zinc-300">
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
            <h2 className="mb-6 text-xl font-medium tracking-tight text-zinc-900 dark:text-white">
              Find me
            </h2>
            <div className="flex flex-col gap-6">
              {[
                { name: 'GitHub', href: 'https://github.com/cevr' },
                { name: 'X', href: 'https://x.com/_cristianvr_' },
                {
                  name: 'LinkedIn',
                  href: 'https://linkedin.com/in/cristianvr',
                },
                {
                  name: 'Email',
                  href: 'mailto:hello@cvr.im?subject=Hi Cristian!',
                },
              ].map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary font-mono text-sm transition-colors hover:underline"
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
