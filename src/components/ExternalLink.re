[@react.component]
let make =
    (
      ~href=?,
      ~className=?,
      ~ariaLabel=?,
      ~children=?,
      ~onMouseEnter=?,
      ~onMouseLeave=?,
    ) =>
  <a
    target="_blank"
    rel="noopener noreferrer"
    ?href
    ?className
    ?ariaLabel
    ?onMouseEnter
    ?onMouseLeave>
    {switch (children) {
     | Some(children) => children
     | None => React.null
     }}
  </a>;
