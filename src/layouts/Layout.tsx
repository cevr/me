import React from 'react';

const Layout: React.FC = ({ children }) => (
  <div className="layout">
    {children}
    <style jsx>{`
      .layout {
        --nav-height: 3.75rem;
        --footer-height: 3.75rem;
        --vertical-padding: 1rem;
        --min-content: calc(
          100vh -
            (
              var(--nav-height) + var(--footer-height) + (var(--vertical-padding) * 2) +
                (var(--grid-gap) * 2)
            )
        );
        display: grid;
        grid-template-areas:
          'nav'
          'content'
          'footer';
        grid-template-rows: var(--nav-height) minmax(var(--min-content), 1fr) var(--footer-height);
        grid-gap: var(--grid-gap);
        padding: var(--vertical-padding) 2.5rem;
        max-width: 67.5rem;
        margin: auto;
      }

      @media (min-width: 50rem) {
        .layout {
          grid-template-rows: var(--nav-height) var(--min-content) var(--footer-height);
        }
      }
    `}</style>
  </div>
);

export default Layout;
