import React from 'react';
import Link from 'next/link';

const storageKey = '__LIGHT';
const classNameLight = 'light';

const toggleTheme = () => {
  const lightMode = JSON.parse(localStorage.getItem(storageKey));
  lightMode
    ? document.body.classList.remove(classNameLight)
    : document.body.classList.add(classNameLight);

  localStorage.setItem(storageKey, JSON.stringify(!lightMode));
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
      <div className="toggler-container">
        <button
          aria-label="Toggle Theme"
          title="Toggle Theme"
          type="button"
          className="theme-toggler"
          onClick={toggleTheme}
        ></button>
      </div>
      <style jsx>{`
        nav {
          display: grid;
          position: sticky;
          grid-area: nav;
          grid-gap: var(--grid-gap-sm);
          grid-template-columns: 10rem 1fr;
          align-items: center;
        }

        .logo {
          font-family: Megrim;
          font-size: 2.5rem;
          user-select: none;
        }
        .logo:hover {
          transition: color var(--transition);
          color: var(--highlight);
        }

        .toggler-container {
          justify-self: end;
        }

        .theme-toggler {
          --size: 1.25rem;
          height: var(--size);
          width: var(--size);
          border: 2px solid var(--fg);
          border-radius: 50%;
          background: transparent;
          cursor: pointer;
          transition: border-color var(--transition) ease-in-out;
        }
        .theme-toggler:hover {
          border-color: var(--highlight);
        }
      `}</style>
    </nav>
  );
};

export default Nav;
