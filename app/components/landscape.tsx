/**
 * Abstract atmospheric gradient with shimmer.
 * Sky at top, background in middle, ground at bottom.
 * Dark mode: twinkling stars near the top.
 */
export function Landscape() {
  return (
    <div className="pointer-events-none fixed inset-0" aria-hidden>
      {/* Sky */}
      <div
        className="absolute inset-x-0 top-0 animate-sky overflow-hidden bg-gradient-to-b from-primary/30 to-transparent"
        style={{
          maskImage: "linear-gradient(to bottom, black 30%, transparent)",
        }}
      >
        <div className="animate-shimmer absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent" />
      </div>

      {/* Ground */}
      <div
        className="absolute inset-x-0 bottom-0 animate-ground overflow-hidden bg-gradient-to-t from-accent/25 to-transparent"
        style={{
          maskImage: "linear-gradient(to top, black 30%, transparent)",
        }}
      >
        <div
          className="animate-shimmer absolute inset-0 bg-gradient-to-r from-transparent via-accent/10 to-transparent"
          style={{ animationDelay: "-7s" }}
        />
      </div>

      {/* Stars — dark mode only */}
      <div className="absolute inset-0 opacity-0 dark:opacity-100 transition-opacity duration-700">
        <Star left="6%" top="3%" delay={0} size={3} />
        <Star left="14%" top="8%" delay={2.2} size={2} />
        <Star left="22%" top="2%" delay={4.1} size={2.5} />
        <Star left="30%" top="11%" delay={1.3} size={2} />
        <Star left="38%" top="5%" delay={3.5} size={3} />
        <Star left="46%" top="14%" delay={5.0} size={2} />
        <Star left="54%" top="4%" delay={1.8} size={2.5} />
        <Star left="62%" top="9%" delay={3.0} size={2} />
        <Star left="70%" top="2%" delay={4.5} size={3} />
        <Star left="78%" top="12%" delay={0.7} size={2} />
        <Star left="86%" top="6%" delay={2.8} size={2.5} />
        <Star left="94%" top="10%" delay={1.0} size={2} />
        <Star left="10%" top="16%" delay={3.8} size={2} />
        <Star left="34%" top="18%" delay={0.5} size={2.5} />
        <Star left="58%" top="17%" delay={2.5} size={2} />
        <Star left="82%" top="15%" delay={4.0} size={3} />
      </div>
    </div>
  );
}

function Star({
  left,
  top,
  delay,
  size,
}: {
  left: string;
  top: string;
  delay: number;
  size: number;
}) {
  return (
    <div
      className="animate-twinkle absolute rounded-full bg-foreground"
      style={{
        left,
        top,
        width: size,
        height: size,
        animationDelay: `${delay}s`,
      }}
    />
  );
}
