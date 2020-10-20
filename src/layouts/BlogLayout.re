type styles = {layout: string};
[@module "./BlogLayout.module.css"] external styles: styles = "default";

[@react.component]
let make = (~children, ~className=?) =>
  <main className=Cn.(styles.layout + className->take)> children </main>;
