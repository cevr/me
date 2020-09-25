[@react.component]
let make = () => {
  let (hovered, setHovered) = React.useState(() => false);

  <ButtonLink
    onMouseEnter={_ => setHovered(_ => true)}
    onMouseLeave={_ => setHovered(_ => false)}
    href="https://en.wikipedia.org/wiki/Kaizen">
    {hovered ? "kaizen" : {|改善|}}->React.string
  </ButtonLink>;
};
