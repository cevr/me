export function ExternalLink(props: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    // eslint-disable-next-line jsx-a11y/anchor-has-content
    <a className="hover:text-primary-500 underline duration-200" target="_blank" rel="noopener noreferrer" {...props} />
  );
}
