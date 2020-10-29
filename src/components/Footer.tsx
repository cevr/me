import ExternalLink from "./ExternalLink";
import styles from "./Footer.module.css";
import { Email, Github, Twitter, LinkedIn } from "./icons";

let email = "hello@cvr.im";

function Footer() {
  return (
    <footer className={styles.footer}>
      <ExternalLink
        className={styles.icon}
        href="https://github.com/cevr"
        aria-label="Github profile"
      >
        <Github />
      </ExternalLink>
      <ExternalLink
        className={styles.icon}
        href="https://twitter.com/_cristianvr_"
        aria-label="Twitter profile"
      >
        <Twitter />
      </ExternalLink>
      <ExternalLink
        className={styles.icon}
        href="https://linkedin.com/in/cristianvr"
        aria-label="LinkedIn profile"
      >
        <LinkedIn />
      </ExternalLink>
      <ExternalLink
        className={styles.icon}
        href={`mailto:${email}?subject=Hi Cristian!`}
        aria-label="email"
      >
        <Email />
      </ExternalLink>
    </footer>
  );
}

export default Footer;
