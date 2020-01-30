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
        grid-gap: 10px;
        padding: 15px 40px;
        max-width: 1080px;
        margin: auto;
      }

      @media (min-width: 1081px) {
        .layout {
          grid-template-rows: 60px calc(100vh - 160px) 60px;
          max-height: 100vh;
        }
      }
    `}</style>
  </div>
);

export default Layout;
