export function ExternalLink(
  props: React.AnchorHTMLAttributes<HTMLAnchorElement>,
) {
  return (
    // eslint-disable-next-line jsx-a11y/anchor-has-content
    <a
      className="underline duration-200 hover:text-salmon-500"
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    />
  );
}
