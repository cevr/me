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
        grid-gap: var(--grid-gap);
        padding: 1rem 2.5rem;
        max-width: 1080px;
        margin: auto;
      }

      @media (min-width: 800px) {
        .layout {
          grid-template-rows: 60px calc(100vh - (120px + 2rem + (var(--grid-gap) * 2))) 60px;
        }
      }
    `}</style>
  </div>
);

export default Layout;
