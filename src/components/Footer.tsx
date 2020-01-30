import React from 'react';
import Link from 'next/link';

import { Github, Twitter } from './icons';
import ExternalLink from './ExternalLink';

const Footer: React.FC = () => {
  return (
    <footer>
      <ExternalLink className="icon" href="https://github.com/cevr" aria-label="Github icon">
        <Github />
      </ExternalLink>
      <ExternalLink className="icon" href="https://twitter.com/_cevr_" aria-label="Twitter icon">
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
          grid-gap: 1.5rem;
          grid-area: footer;
        }
        :global(footer .icon) {
          height: 1.5rem;
          width: 1.5rem;
          color: var(--accent);
          transition: color var(--transition);
        }
        :global(footer .icon:hover) {
          color: var(--highlight);
        }
        a {
          font-weight: 300;
          color: var(--accent);
          transition: color var(--transition);
        }
        a:hover {
          color: var(--highlight);
        }
      `}</style>
    </footer>
  );
};

export default Footer;
