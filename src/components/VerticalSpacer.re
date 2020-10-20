[@react.component]
let make = (~size: [ | `sm | `md | `lg]=`md) =>
  <div
    style={ReactDOM.Style.make(
      ~margin=
        switch (size) {
        | `sm => "0.5rem 0"
        | `md => "1rem 0"
        | `lg => "1.5rem 0"
        },
      (),
    )}
  />;
