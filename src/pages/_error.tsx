import Link from "next/link";

import styles from "./fallback.module.css";

function Error() {
  return (
    <main className={styles.main}>
      <div>
        <p>What??! Something went wrong you say?</p>
        <p>
          Click this{" "}
          <Link href="/">
            <a
              className={styles["link-home"]}
              aria-title="home link"
              aria-label="home link"
            >
              link
            </a>
          </Link>{" "}
          back home and pretend you never saw anything.
        </p>
      </div>
    </main>
  );
}

export default Error;
