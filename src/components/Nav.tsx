import React from 'react';
import Link from 'next/link';

import LightSwitch from './icons/LightSwitch';

const storageKey = '__LIGHT';
const lightModeClassName = 'light';

const toggleTheme = () => {
  const lightModeOn = document.body.classList.contains(lightModeClassName);
  localStorage.setItem(storageKey, JSON.stringify(!lightModeOn));
  lightModeOn
    ? document.body.classList.remove(lightModeClassName)
    : document.body.classList.add(lightModeClassName);
};

const Nav = () => {
  return (
    <nav>
      <div className="logoContainer">
        <Link href="/">
          <a className="logo" aria-label="logo" title="Logo">
            CVR
          </a>
        </Link>
      </div>
      <button className="switch" onClick={toggleTheme}>
        <LightSwitch aria-label="Toggle Theme" />
      </button>
      <style jsx>{`
        nav {
          grid-area: nav;
          position: sticky;
          top: 0;
          background-color: var(--bg);
          transition: background-color var(--transition);
          display: grid;
          grid-gap: var(--grid-gap);
          grid-template-columns: 10rem 1fr;
          align-items: center;
        }

        .logo {
          font-family: Megrim;
          font-size: 2.5rem;
          user-select: none;
          color: var(--fg);
        }
        .logo:hover {
          transition: color var(--transition);
          color: var(--highlight);
        }

        .switch {
          justify-self: end;
          --size: 2.5rem;
          height: var(--size);
          width: var(--size);
          color: var(--fg);
          cursor: pointer;
          transition: color var(--transition) ease-in-out;
          border-radius: 0.25rem;
        }
        .switch:hover {
          color: var(--highlight);
        }

        @media (min-width: 50rem) {
          .switch {
            margin-right: 0.625rem;
          }
        }
      `}</style>
    </nav>
  );
};

export default Nav;
