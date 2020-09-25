[@react.component]
let make =
    (
      ~href: string,
      ~className: option(string)=?,
      ~ariaLabel: option(string)=?,
      ~children: option(React.element)=?,
      ~onMouseEnter: option(ReactEvent.Mouse.t => unit)=?,
      ~onMouseLeave: option(ReactEvent.Mouse.t => unit)=?,
    ) =>
  <a
    target="_blank"
    rel="noopener noreferrer"
    href
    ?className
    ?ariaLabel
    ?onMouseEnter
    ?onMouseLeave>
    {switch (children) {
     | Some(children) => children
     | None => React.null
     }}
  </a>;
