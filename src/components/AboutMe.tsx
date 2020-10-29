import * as React from "react";
import clsx from "clsx";

import ButtonLink from "./ButtonLink";
import KaizenLink from "./KaizenLink";
import styles from "./AboutMe.module.css";

function AboutMe() {
  return (
    <section className={styles.about}>
      <NameTitle />
      <p className={styles.desc}>
        A growing developer with a heart of code. I have a passion for
        improvement, believing fully in <KaizenLink />. I'm looking to do what I
        can with a keyboard at hand.
      </p>
      <p className={styles.interests}>
        I specialize in{" "}
        <ButtonLink href="https://reactjs.org/">React</ButtonLink>, I'm a fan of{" "}
        <ButtonLink href="https://graphql.org/">GraphQL</ButtonLink>, I use{" "}
        <ButtonLink href="https://www.typescriptlang.org/">
          Typescript
        </ButtonLink>{" "}
        daily, and I love{" "}
        <ButtonLink href="https://nextjs.org/#features">Next.js</ButtonLink>.
        <br />
        In fact,{" "}
        <ButtonLink href="https://github.com/cevr/me">
          this website
        </ButtonLink>{" "}
        is using all of them!
      </p>
    </section>
  );
}

export default AboutMe;

function NameTitle() {
  let [showFull, setShowFull] = React.useState(false);

  React.useEffect(() => {
    setTimeout(() => setShowFull(true), 1500);
  }, []);

  return (
    <h1>
      <span className={styles.name}>
        <span>C</span>
        {showFull ? (
          <span className={clsx(styles.animatingName, styles.firstName)}>
            ristian
          </span>
        ) : null}{" "}
      </span>
      <span className={styles.name}>
        <span>V</span>
        {showFull ? (
          <span className={clsx(styles.animatingName, styles.firstFamilyName)}>
            elasquez
          </span>
        ) : null}{" "}
      </span>
      <span className={styles.name}>
        <span>R</span>
        {showFull ? (
          <span className={clsx(styles.animatingName, styles.secondFamilyName)}>
            amos
          </span>
        ) : null}
      </span>
    </h1>
  );
}
