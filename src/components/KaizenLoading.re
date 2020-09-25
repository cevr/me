type styles = {
  [@as "kaizen-loading"]
  kaizenLoading: string,
};
[@module "./KaizenLoading.module.css"] external styles: styles = "default";

[@react.component]
let make = () =>
  <div className={styles.kaizenLoading}> {j|改善|j}->React.string </div>;
