import { NavLink } from '@remix-run/react';

import { cn } from '~/lib/utils/cn';

// import { LightSwitch } from "./icons";

export function Nav() {
  return (
    <nav className="z-10 grid h-16 grid-cols-[auto,1fr] items-end gap-6 font-mono transition-colors">
      <NavLink
        to="/"
        className={({ isActive }) =>
          cn(
            'w-[110px] border-b-2 border-transparent font-[Signerica] text-[2.5rem] text-neutral-50 transition-colors hover:text-salmon-500',
            { 'border-salmon-500': isActive },
          )
        }
        aria-label="logo"
        title="Logo"
      >
        cvr
      </NavLink>
      <div className="flex items-end justify-start">
        <NavLink
          to="/blog"
          className={({ isActive }) =>
            cn(
              'block border-b-2 border-transparent leading-[3] text-neutral-50 duration-200 hover:text-salmon-500',
              {
                'border-salmon-500': isActive,
              },
            )
          }
          aria-label="blog"
          title="blog"
        >
          Blog
        </NavLink>
        <div />
      </div>
      {/* <form action="/theme" method="POST">
        <button className="switch" name="theme" value={theme === "dark" ? "light" : "dark"}>
          <LightSwitch aria-label="Toggle Theme" on={theme === "light"} />
        </button>
      </form> */}
    </nav>
  );
}
