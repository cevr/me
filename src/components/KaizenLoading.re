type styles = {
  [@as "kaizen-loading"]
  kaizenLoading: string,
};
[@module "./KaizenLoading.module.css"] external styles: styles = "default";

[@react.component]
let make = () =>
  <div className={styles.kaizenLoading}> {|改善|}->React.string </div>;
