import React from "react";
import ButtonLink from "./ButtonLink";

function KaizenLink() {
  let [hovered, setHovered] = React.useState(false);
  return (
    <ButtonLink
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      href="https://en.wikipedia.org/wiki/Kaizen"
    >
      {hovered ? "kaizen" : `改善`}
    </ButtonLink>
  );
}

export default KaizenLink;
