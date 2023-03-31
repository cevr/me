import { ExternalLink } from "./ExternalLink";

export function ButtonLink({ className, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <ExternalLink
      className="whitespace-nowrap rounded-md bg-[var(--link-bg)] px-2 py-1 text-[var(--highlight)] duration-200 hover:bg-[var(--highlight)] hover:text-[var(--link-hover-fg)]"
      {...props}
    />
  );
}
