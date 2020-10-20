import React from "react";
import Highlight, { defaultProps } from "prism-react-renderer";

const theme = {
  plain: {
    color: "var(--fg)",
    backgroundColor: "var(--code-bg)",
    transition: "all var(--transition)",
    fontFamily: '"SFMono-Regular", monospace',
  },
  styles: [
    {
      types: ["prolog", "constant", "builtin", "function"],
      style: {
        color: "var(--code-func)",
      },
    },
    {
      types: ["inserted"],
      style: {
        color: "#27D797B3",
      },
    },
    {
      types: ["deleted"],
      style: {
        color: "#F43E5C",
      },
    },
    {
      types: ["changed"],
      style: {
        color: "#FAB38E",
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

export function CodeBlock(props) {
  const language = props.className
    ? props.className.replace(/language-/, "")
    : "";

  return (
    <Highlight
      {...defaultProps}
      theme={theme}
      code={props.children.trim()}
      language={language}
    >
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre
          className={className}
          style={{
            ...style,
            padding: "var(--grid-gap)",
            borderRadius: "0.5rem",
            overflow: "auto",
          }}
        >
          {tokens.map((line, i) => (
            <div key={i} {...getLineProps({ line, key: i })}>
              {line.map((token, key) => (
                <span key={key} {...getTokenProps({ token, key })} />
              ))}
            </div>
          ))}
        </pre>
      )}
    </Highlight>
  );
}
