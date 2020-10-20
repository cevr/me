type styles = {
  [@as "paragraph-link"]
  paragraphLink: string,
};
[@module "./ButtonLink.module.css"] external styles: styles = "default";

[@react.component]
let make =
    (
      ~href=?,
      ~className: option(string)=?,
      ~onMouseEnter: option(ReactEvent.Mouse.t => unit)=?,
      ~onMouseLeave: option(ReactEvent.Mouse.t => unit)=?,
      ~children: option(React.element)=?,
    ) =>
  <ExternalLink
    className=Cn.(styles.paragraphLink + className->take)
    ?href
    ?onMouseEnter
    ?onMouseLeave
    ?children
  />;
