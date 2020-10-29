import clsx from "clsx";

import styles from "./Layout.module.css";

let style = {
  "--min-content": `
  calc(
    100vh -
      (
        var(--nav-height) + var(--footer-height) + (var(--vertical-padding) * 2) +
          (var(--grid-gap) * 2)
      )
  )`,
};

interface LayoutProps {
  children: React.ReactNode;
  home?: boolean;
}

function Layout({ children, home }: LayoutProps) {
  return (
    <div
      style={style as any}
      className={clsx(styles.layout, { [styles.home]: home })}
    >
      {children}
    </div>
  );
}

export default Layout;
