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
          grid-gap: 8px;
          grid-template-columns: 150px 1fr;
          align-items: center;
        }

        .logoContainer {
        }
        .logo {
          font-family: Megrim;
          font-size: 40px;
          user-select: none;
        }
        .logo:hover {
          transition: color 0.15s;
          color: var(--highlight);
        }

        .toggler-container {
          justify-self: end;
        }

        .theme-toggler {
          --size: 20px;
          height: var(--size);
          width: var(--size);
          border: 2px solid var(--fg);
          border-radius: 50%;
          background: transparent;
          cursor: pointer;
          transition: border-color 0.15s ease-in-out;
        }
        .theme-toggler:hover {
          border-color: var(--highlight);
        }
      `}</style>
    </nav>
  );
};

export default Nav;
