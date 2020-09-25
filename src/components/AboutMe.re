type styles = {
  about: string,
  desc: string,
  interests: string,
};
[@module "./AboutMe.module.css"] external styles: styles = "default";

[@react.component]
let make = () =>
  <section className={styles.about}>
    <h1> "Hi,"->React.string <br /> "I'm Cristian."->React.string </h1>
    <p className={styles.desc}>
      "I'm a frontend developer though sometimes I call myself a full-stack
        developer too. I have a passion for improvement, believing fully in "
      ->React.string
      <KaizenLink />
      ". I'm looking to do what I can with a keyboard at hand."->React.string
    </p>
    <p className={styles.interests}>
      "I specialize in "->React.string
      <ButtonLink href="https://reactjs.org/">
        "React"->React.string
      </ButtonLink>
      ", I'm invested in "->React.string
      <ButtonLink href="https://graphql.org/">
        "GraphQL"->React.string
      </ButtonLink>
      ", I'm super interested in "->React.string
      <ButtonLink href="https://reasonml.github.io/">
        "ReasonML"->React.string
      </ButtonLink>
      " and
        I love "->React.string
      <ButtonLink href="https://nextjs.org/#features">
        "Next.js"->React.string
      </ButtonLink>
      "."->React.string
      <br />
      "In fact, "->React.string
      <ButtonLink href="https://github.com/cevr/me">
        "this project"->React.string
      </ButtonLink>
      " is using all of those technologies!"->React.string
    </p>
  </section>;
