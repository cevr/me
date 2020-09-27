[@val] external setTimeout: (unit => unit, int) => unit = "setTimeout";
[@val]
external windowAddEventListener: (string, unit => unit) => unit =
  "window.addEventListener";
[@val]
external windowRemoveEventListener: (string, unit => unit) => unit =
  "window.removeEventListener";

type styles = {
  about: string,
  desc: string,
  interests: string,
  name: string,
  [@as "animating-name"]
  animatingName: string,
  [@as "name-hidden"]
  nameHidden: string,
  [@as "first-name"]
  firstName: string,
  [@as "first-family-name"]
  firstFamilyName: string,
  [@as "second-family-name"]
  secondFamilyName: string,
};
[@module "./AboutMe.module.css"] external styles: styles = "default";

module NameTitle = {
  [@react.component]
  let make = () => {
    let (showFull, setShowFull) = React.useState(() => false);

    React.useEffect0(() => {
      setTimeout(() => setShowFull(_ => true), 1500);
      None;
    });

    <h1>
      <span className={styles.name}>
        <span> "C"->React.string </span>
        {showFull
           ? <span className=Cn.(styles.animatingName + styles.firstName)>
               "ristian "->React.string
             </span>
           : React.null}
      </span>
      <span className={styles.name}>
        <span> "V"->React.string </span>
        {showFull
           ? <span
               className=Cn.(styles.animatingName + styles.firstFamilyName)>
               "elasquez "->React.string
             </span>
           : React.null}
      </span>
      <span className={styles.name}>
        <span> "R"->React.string </span>
        {showFull
           ? <span
               className=Cn.(styles.animatingName + styles.secondFamilyName)>
               "amos"->React.string
             </span>
           : React.null}
      </span>
    </h1>;
  };
};

[@react.component]
let make = () => {
  <section className={styles.about}>
    <NameTitle />
    <p className={styles.desc}>
      "A growing developer with a heart of code. I have a passion for improvement, believing fully in "
      ->React.string
      <KaizenLink />
      ". I'm looking to do what I can with a keyboard at hand."->React.string
    </p>
    <p className={styles.interests}>
      "I specialize in "->React.string
      <ButtonLink href="https://reactjs.org/">
        "React"->React.string
      </ButtonLink>
      ", I'm a fan of "->React.string
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
        "this website"->React.string
      </ButtonLink>
      " is using all of them!"->React.string
    </p>
  </section>;
};
