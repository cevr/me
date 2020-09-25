type styles = {
  footer: string,
  icon: string,
};
[@module "./Footer.module.css"] external styles: styles = "default";

let email = "hello@cvr.im";

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
    <ExternalLink
      className={styles.icon}
      href={j|mailto:$email?subject=Hi Cristian!|j}
      ariaLabel="email">
      <Email />
    </ExternalLink>
  </footer>;
