import Link from "next/link";

import Fallback from "@layouts/Fallback";
import styles from "./404.module.css";

function Custom404() {
  return (
    <Fallback>
      <div>
        <p>Nope! This page definitely doesn't exist. Just checked.</p>
        <p>
          Take this{" "}
          <Link href="/">
            <a
              className={styles["link-home"]}
              aria-title="home link"
              aria-label="home link"
            >
              link
            </a>
          </Link>{" "}
          back home
        </p>
      </div>
    </Fallback>
  );
}

export default Custom404;
