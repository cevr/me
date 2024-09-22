export function ExternalLink(
  props: React.AnchorHTMLAttributes<HTMLAnchorElement>,
) {
  return (
    <a
      className="underline duration-200 hover:text-salmon-500"
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    />
  );
}
