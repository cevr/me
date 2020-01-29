import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import clsx from 'clsx';

import Logo from './Logo';

const links = [
  { href: '/', label: 'Me' },
  { href: '/projects', label: 'Projects' },
  { href: '/contact', label: 'Contact' },
].map(link => ({
  ...link,
  key: `nav-link-${link.href}-${link.label}`,
}));

const Nav = () => {
  const { asPath } = useRouter();

  return (
    <nav>
      <div className="logo">
        <Link href="/">
          <Logo />
        </Link>
      </div>
      <div className="links">
        {links.map(({ key, href, label }) => (
          <Link href={href} key={key}>
            <a
              className={clsx('nav-link', {
                active: asPath === href,
              })}
            >
              {label}
            </a>
          </Link>
        ))}
      </div>
      <style jsx>{`
        nav {
          display: grid;
          position: sticky;
          grid-area: nav;
          grid-gap: 8px;
          grid-template-columns: 150px 1fr;
          align-items: center;
        }

        .logo {
          font-family: Megrim;
          font-size: 40px;
          transition: color 0.15s;
          height: 32px;
        }
        .logo:hover {
          color: salmon;
        }

        .page-title {
          font-weight: 600;
        }
        .nav-link {
          margin-right: 16px;
          border-radius: 6px;
          padding: 6px 16px;
          font-weight: 500;
          transition: all 0.15s;
        }
        .nav-link:hover {
          background: salmon;
        }

        .nav-link.active {
          color: var(--bg);
          background: var(--fg);
        }
      `}</style>
    </nav>
  );
};

export default Nav;
