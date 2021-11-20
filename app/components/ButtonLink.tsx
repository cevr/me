import { ExternalLink } from './ExternalLink';

export function ButtonLink({
  className,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return <ExternalLink className="paragraph-link" {...props} />;
}
