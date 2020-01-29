import React from 'react';

const Layout: React.FC = ({ children }) => (
  <div className="layout">
    {children}
    <style jsx>{`
      .layout {
        display: grid;
        grid-template-areas:
          'nav      nav     nav'
          'content  content content'
          'footer   footer  footer';
        grid-template-rows: 1fr 8fr 1fr;
        height: 100vh;
        padding: 40px;
      }
    `}</style>
  </div>
);

export default Layout;
