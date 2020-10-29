import clsx from "clsx";

import ExternalLink from "./ExternalLink";
import styles from "./ButtonLink.module.css";

function ButtonLink({
  className,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <ExternalLink
      className={clsx(styles["paragraph-link"], className)}
      {...props}
    />
  );
}

export default ButtonLink;
