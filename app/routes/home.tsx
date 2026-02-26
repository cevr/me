import { PageLayout } from "~/components/page-layout";

export default function Home() {
  return (
    <PageLayout nav={{ to: "/blog", label: "writing →" }}>
      <h1 className="mt-10 text-2xl font-medium tracking-tight">cristian</h1>

      <p className="mt-3 leading-relaxed text-muted-foreground">
        building things with care.
      </p>

      <nav
        className="-mx-2 mt-6 flex gap-1 font-mono text-sm"
        aria-label="Social links"
      >
        <a
          href="https://github.com/cevr"
          className="rounded-md px-2 py-2 text-muted-foreground transition-colors hover:text-foreground"
          target="_blank"
          rel="noopener noreferrer"
        >
          github
        </a>
        <span className="self-center text-border" aria-hidden>
          /
        </span>
        <a
          href="https://x.com/_cristianvr_"
          className="rounded-md px-2 py-2 text-muted-foreground transition-colors hover:text-foreground"
          target="_blank"
          rel="noopener noreferrer"
        >
          x
        </a>
        <span className="self-center text-border" aria-hidden>
          /
        </span>
        <a
          href="mailto:hello@cvr.im"
          className="rounded-md px-2 py-2 text-muted-foreground transition-colors hover:text-foreground"
        >
          email
        </a>
      </nav>
    </PageLayout>
  );
}
