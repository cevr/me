import { ExternalLink } from "./ExternalLink";

export function ButtonLink({ className, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <ExternalLink
      className="text-[var(--highlight)] py-1 px-2 rounded-md duration-200 bg-[var(--link-bg)] whitespace-nowrap hover:bg-[var(--highlight)] hover:text-[var(--link-hover-fg)]"
      {...props}
    />
  );
}
