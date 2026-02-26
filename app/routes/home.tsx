import { useTheme } from "~/lib/theme";

const swatches = [
  { name: "background", var: "bg-background", text: "text-foreground" },
  { name: "card", var: "bg-card", text: "text-card-foreground" },
  { name: "primary", var: "bg-primary", text: "text-primary-foreground" },
  { name: "secondary", var: "bg-secondary", text: "text-secondary-foreground" },
  { name: "muted", var: "bg-muted", text: "text-muted-foreground" },
  { name: "accent", var: "bg-accent", text: "text-accent-foreground" },
  { name: "destructive", var: "bg-destructive", text: "text-primary-foreground" },
] as const;

export default function Home() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-svh bg-background p-8 text-foreground">
      <div className="mx-auto max-w-2xl">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Ghibli Palette</h1>
          <button
            onClick={toggleTheme}
            className="rounded-md border border-border px-3 py-1.5 text-sm transition-colors hover:bg-secondary"
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            {theme === "dark" ? "Light" : "Dark"}
          </button>
        </div>

        <p className="mt-4 text-muted-foreground">
          {theme === "light"
            ? "Laputa Blue — Castle in the Sky, open expanse"
            : "Night Sky — Howl's castle under stars"}
        </p>

        <div className="mt-8 grid gap-3">
          {swatches.map((s) => (
            <div
              key={s.name}
              className={`${s.var} ${s.text} flex items-center justify-between rounded-lg border border-border px-4 py-3`}
            >
              <span className="font-medium">{s.name}</span>
              <span className="text-sm opacity-70">{s.var}</span>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-lg border border-border bg-card p-6">
          <h2 className="text-lg font-bold text-card-foreground">
            Card Example
          </h2>
          <p className="mt-2 text-muted-foreground text-pretty">
            The forest breathed slowly, each tree a patient witness to the
            passing of quiet centuries. Somewhere between the moss and the
            morning light, something small and kind waited.
          </p>
          <div className="mt-4 flex gap-3">
            <button className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:opacity-90">
              Primary
            </button>
            <button className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-colors hover:opacity-90">
              Accent
            </button>
            <button className="rounded-md bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground transition-colors hover:opacity-90">
              Secondary
            </button>
          </div>
        </div>

        <p className="mt-6 text-sm text-muted-foreground">
          Try selecting this text to see the terracotta selection color.
        </p>
      </div>
    </div>
  );
}
