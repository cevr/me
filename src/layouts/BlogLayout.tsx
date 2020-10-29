import clsx from "clsx";

import styles from "./BlogLayout.module.css";

interface BlogLayoutProps {
  children: React.ReactNode;
  className?: string;
}

function BlogLayout({ children, className }: BlogLayoutProps) {
  return <main className={clsx(styles.layout, className)}>{children}</main>;
}

export default BlogLayout;
