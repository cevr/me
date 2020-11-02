import Fallback from "@layouts/Fallback";
import styles from "./KaizenLoading.module.css";

let KaizenLoading = () => (
  <Fallback>
    <div>
      <p className={styles.kaizen}>改善</p>
      <p>This page probably exists, let me check...</p>
    </div>
  </Fallback>
);

export default KaizenLoading;
