type styles = {
  layout: string,
  home: string,
};
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
let make = (~children: React.element, ~home) => {
  <div
    style={ReactDOM.Style.unsafeAddProp(
      ReactDOM.Style.make(),
      "--min-content",
      minContent,
    )}
    className=Cn.(styles.layout + styles.home->on(home))>
    children
  </div>;
};
