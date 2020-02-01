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
          justify-content: start;
          align-content: center;
          grid-auto-flow: column;
          grid-gap: 1.5rem;
          grid-area: footer;
        }

        :global(a) {
          color: var(--accent);
          transition: color var(--transition);
          font-weight: 300;
        }
        :global(a:hover) {
          color: var(--highlight);
        }

        :global(.icon) {
          height: 1.5rem;
          width: 1.5rem;
        }

        @media (max-width: 800px) {
          footer {
            justify-content: center;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
