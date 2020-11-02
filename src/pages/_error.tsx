import Link from "next/link";

import Fallback from "@layouts/Fallback";
import styles from "./404.module.css";

function Error() {
  return (
    <Fallback>
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
    </Fallback>
  );
}

export default Error;
