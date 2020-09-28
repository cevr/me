type styles = {layout: string};
[@module "./Layout.module.css"] external styles: styles = "default";

// workaround for https://github.com/vercel/next.js/issues/17350
let minContent = {|calc(
    100vh -
      (
        var(--nav-height) + var(--footer-height) + (var(--vertical-padding) * 2) +
          (var(--grid-gap) * 2)
      )
  )|};

[@react.component]
let make = (~children: React.element) => {
  <div
    style={ReactDOM.Style.unsafeAddProp(
      ReactDOM.Style.make(),
      "--min-content",
      minContent,
    )}
    className={styles.layout}>
    children
  </div>;
};
