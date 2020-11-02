import * as React from "react";
import styles from "./Fallback.module.css";

interface FallbackProps {
  children: React.ReactNode;
}

function Fallback({ children }: FallbackProps) {
  return <main className={styles.fallback}>{children}</main>;
}

export default Fallback;
