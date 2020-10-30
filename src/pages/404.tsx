import Link from "next/link";

import styles from "./404.module.css";

function Custom404() {
  return (
    <main className={styles.four}>
      <div>
        <p>There's nothing here but you...</p>
        <p>
          And this{" "}
          <Link href="/">
            <a className={styles["link-home"]} aria-title="home link" aria-label="home link">
              link
            </a>
          </Link>{" "}
          back home
        </p>
      </div>
    </main>
  );
}

export default Custom404;
