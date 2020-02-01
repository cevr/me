import React from 'react';

const Layout: React.FC = ({ children }) => (
  <div className="layout">
    {children}
    <style jsx>{`
      .layout {
        display: grid;
        grid-template-areas:
          'nav'
          'content'
          'footer';
        grid-gap: var(--grid-gap-sm);
        padding: 1rem 2.5rem;
        max-width: 1080px;
        margin: auto;
      }

      @media (min-width: 800px) {
        .layout {
          grid-template-rows: 60px 1fr 60px;
          max-height: 100vh;
        }
      }
    `}</style>
  </div>
);

export default Layout;
