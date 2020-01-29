import React from 'react';

import Github from './Github';
import Twitter from './Twitter';

const Footer: React.FC = () => {
  return (
    <footer>
      <a className="icon" href="https://github.com/cevr" target="_blank" rel="noopener noreferrer">
        <Github />
      </a>
      <a
        className="icon"
        href="https://twitter.com/_cevr_"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Twitter />
      </a>
      <style jsx>{`
        footer {
          display: grid;
          justify-content: center;
          align-content: center;
          grid-auto-flow: column;
          grid-gap: 24px;
          grid-area: footer;
        }
        .icon {
          height: 24px;
          width: 24px;
          color: var(--accent);
          transition: color 0.15s;
        }
        .icon:hover {
          color: var(--footer-hover);
        }
      `}</style>
    </footer>
  );
};

export default Footer;
