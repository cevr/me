type styles = {
  footer: string,
  icon: string,
};
[@module "./Footer.module.css"] external styles: styles = "default";

[@react.component]
let make = () =>
  <footer className={styles.footer}>
    <ExternalLink
      className={styles.icon}
      href="https://github.com/cevr"
      ariaLabel="Github profile">
      <Github />
    </ExternalLink>
    <ExternalLink
      className={styles.icon}
      href="https://twitter.com/_cristianvr_"
      ariaLabel="Twitter profile">
      <Twitter />
    </ExternalLink>
    <ExternalLink
      className={styles.icon}
      href="https://linkedin.com/in/cristianvr"
      ariaLabel="LinkedIn profile">
      <LinkedIn />
    </ExternalLink>
    <Next.Link href="/contact"> <a> "Contact"->React.string </a> </Next.Link>
  </footer>;
