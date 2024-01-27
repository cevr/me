import { ExternalLink } from "./external-link";
import { Email, Github, LinkedIn, Twitter } from "./icons";

let email = "hello@cvr.im";

const footerLinkClassName = "text-neutral-400 hover:text-salmon-500 duration-200 font-light h-6 w-6";

export function Footer() {
  return (
    <footer
      style={{
        gridArea: "footer",
      }}
      className="flex items-center justify-center gap-6 py-6 sm:justify-between h-16"
    >
      <div className="flex items-center gap-5">
        <ExternalLink
          className={footerLinkClassName}
          href="https://github.com/cevr"
          aria-label="Github profile"
          rel="me"
        >
          <Github />
        </ExternalLink>
        <ExternalLink
          className={footerLinkClassName}
          href="https://twitter.com/_cristianvr_"
          aria-label="Twitter profile"
          rel="me"
        >
          <Twitter />
        </ExternalLink>
        <ExternalLink
          className={footerLinkClassName}
          href="https://linkedin.com/in/cristianvr"
          aria-label="LinkedIn profile"
        >
          <LinkedIn />
        </ExternalLink>
        <ExternalLink
          className={footerLinkClassName}
          href={`mailto:${email}?subject=Hi Cristian!`}
          aria-label="email"
          rel="me"
        >
          <Email />
        </ExternalLink>
      </div>
    </footer>
  );
}
