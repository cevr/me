import { ExternalLink } from "./ExternalLink";

export function ButtonLink({ className, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <ExternalLink
      className="whitespace-nowrap rounded-md bg-neutral-700 px-2 py-1 text-salmon-500 duration-200 hover:bg-salmon-500 hover:text-neutral-900"
      {...props}
    />
  );
}
