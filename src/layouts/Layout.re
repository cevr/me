type styles = {layout: string};
[@module "./Layout.module.css"] external styles: styles = "default";

[@send] [@scope "style"]
external setProperty: (Dom.element_like('any), string, string) => unit =
  "setProperty";

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
  let divRef = React.useRef(Js.Nullable.null);
  Hooks.useIsomorphicLayoutEffect0(() => {
    switch (Js.Nullable.toOption(divRef.current)) {
    | Some(ref) => ref->setProperty("--min-content", minContent)
    | None => ()
    };
    None;
  });

  <div ref={ReactDOM.Ref.domRef(divRef)} className={styles.layout}>
    children
  </div>;
};
