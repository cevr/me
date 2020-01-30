import React from 'react';
import Link from 'next/link';

import { Github, Twitter } from './icons';
import ExternalLink from './ExternalLink';

const Footer: React.FC = () => {
  return (
    <footer>
      <ExternalLink className="icon" href="https://github.com/cevr">
        <Github />
      </ExternalLink>
      <ExternalLink className="icon" href="https://twitter.com/_cevr_">
        <Twitter />
      </ExternalLink>
      <Link href="/contact">
        <a>Contact</a>
      </Link>
      <style jsx>{`
        footer {
          display: grid;
          justify-content: center;
          align-content: center;
          grid-auto-flow: column;
          grid-gap: 24px;
          grid-area: footer;
        }
        :global(footer .icon) {
          height: 24px;
          width: 24px;
          color: var(--accent);
          transition: color 0.15s;
        }
        :global(footer .icon:hover) {
          color: var(--highlight);
        }
        a {
          font-weight: 300;
          color: var(--accent);
          transition: color 0.15s;
        }
        a:hover {
          color: var(--highlight);
        }
      `}</style>
    </footer>
  );
};

export default Footer;
