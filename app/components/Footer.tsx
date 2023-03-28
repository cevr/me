import dayjs from "dayjs";

import { ExternalLink } from "./ExternalLink";
import { Email, Github, LinkedIn, Twitter } from "./icons";

let email = "hello@cvr.im";

type FooterProps = {
  date: string;
};

const footerLinkClassName = "text-[var(--accent)] hover:text-[var(--highlight)] duration-200 font-light h-6 w-6";

export function Footer({ date }: FooterProps) {
  return (
    <footer
      style={{
        gridArea: "footer",
      }}
      className="flex justify-center sm:justify-between items-center gap-6 py-6"
    >
      <div className="flex gap-5 items-center">
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

      <div className="text-xs text-gray-400">Rendered on {dayjs(date).format("dddd, MMMM D YYYY [at] hh:mm A")}</div>
    </footer>
  );
}
