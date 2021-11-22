import dayjs from 'dayjs';

import { ExternalLink } from "./ExternalLink";
import { Email, Github, Twitter, LinkedIn } from "./icons";

let email = "hello@cvr.im";

type FooterProps = {
  date: string;
}

export function Footer({ date }: FooterProps) {
  return (
    <footer className="footer">
      <div className="flex gap-5 items-center">
        <ExternalLink
          className="icon"
          href="https://github.com/cevr"
          aria-label="Github profile"
          rel="me"
        >
          <Github />
        </ExternalLink>
        <ExternalLink
          className="icon"
          href="https://twitter.com/_cristianvr_"
          aria-label="Twitter profile"
          rel="me"
        >
          <Twitter />
        </ExternalLink>
        <ExternalLink
          className="icon"
          href="https://linkedin.com/in/cristianvr"
          aria-label="LinkedIn profile"
        >
          <LinkedIn />
        </ExternalLink>
        <ExternalLink
          className="icon"
          href={`mailto:${email}?subject=Hi Cristian!`}
          aria-label="email"
          rel="me"
        >
          <Email />
        </ExternalLink>
      </div>

      <div className="text-xs text-gray-400">
        Rendered on {dayjs(date).format("dddd, MMMM D YYYY [at] hh:mm A")}
      </div>
    </footer>
  );
}
