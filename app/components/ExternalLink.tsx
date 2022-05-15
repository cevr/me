export function ExternalLink(props: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  // eslint-disable-next-line jsx-a11y/anchor-has-content
  return <a target="_blank" rel="noopener noreferrer" {...props} />;
}
