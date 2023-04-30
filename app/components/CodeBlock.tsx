import type { Prism } from "prism-react-renderer";

import { Highlight } from "prism-react-renderer";

const theme = {
  plain: {
    color: "var(--neutral-50)",
    backgroundColor: "var(--code-bg)",
    transition: "all 0.2s ease-out",
    fontFamily: '"SFMono-Regular", monospace',
  },
  styles: [
    {
      types: ["prolog", "constant", "builtin", "function", "boolean", "number", "maybe-class-name"],
      style: {
        color: "var(--code-func)",
      },
    },
    {
      types: ["punctuation", "symbol"],
      style: {
        color: "var(--code-punc)",
      },
    },
    {
      types: ["string", "char", "tag", "selector"],
      style: {
        color: "var(--code-string)",
      },
    },
    {
      types: ["keyword", "variable"],
      style: {
        color: "var(--code-keyword)",
      },
    },
    {
      types: ["comment"],
      style: {
        color: "var(--code-comment)",
      },
    },
    {
      types: ["attr-name"],
      style: {
        color: "var(--code-string)",
      },
    },
  ],
};

const RE = /{([\d,-]+)}/;

const calculateLinesToHighlight = (meta: string) => {
  if (!RE.test(meta)) {
    return () => false;
  }
  const lineNumbers = RE.exec(meta)?.[1]
    .split(`,`)
    .map((v) => v.split(`-`).map((x) => parseInt(x, 10)));
  return (index: number) => {
    const lineNumber = index + 1;
    const inRange = lineNumbers?.some(([start, end]) =>
      end ? lineNumber >= start && lineNumber <= end : lineNumber === start,
    );
    return inRange;
  };
};

interface CodeBlockProps {
  className?: string;
  metastring: string;
  children: string;
}

export function CodeBlock(props: CodeBlockProps) {
  const language = (props.className ? props.className.replace(/language-/, "") : "markup") as Prism.Languages[number];

  const shouldHighlightLine = calculateLinesToHighlight(props.metastring);

  return (
    <Highlight theme={theme} code={props.children.trim()} language={language as any}>
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre
          className={className}
          style={{
            ...style,
            padding: "1rem",
            borderRadius: "0.5rem",
            overflow: "auto",
          }}
        >
          {tokens.map((line, i) => {
            const lineProps = getLineProps({ line, key: i });
            if (shouldHighlightLine(i)) {
              lineProps.className = `${lineProps.className} highlight-line`;
            }

            return (
              <div key={i} {...lineProps}>
                <span className="line-number">{i + 1}</span>
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token, key })} />
                ))}
              </div>
            );
          })}
        </pre>
      )}
    </Highlight>
  );
}
