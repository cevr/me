type styles = {layout: string};
[@module "./Layout.module.css"] external styles: styles = "default";

[@react.component]
let make = (~children: React.element) =>
  <div className={styles.layout}> children </div>;
