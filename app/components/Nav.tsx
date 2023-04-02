import { NavLink } from "@remix-run/react";

import { cn } from "~/lib/utils/cn";

// import { LightSwitch } from "./icons";

export function Nav() {
  return (
    <nav className="z-10 grid grid-cols-[10rem,1fr] items-center gap-5 transition-colors md:gap-2 h-16">
      <div className="flex items-end gap-4">
        <NavLink
          to="/"
          className={({ isActive }) =>
            cn(
              "border-b-2 border-transparent font-[Megrim] text-[2.5rem] text-[var(--fg)] transition-colors hover:text-[var(--highlight)]",
              { "border-[var(--highlight)]": isActive },
            )
          }
          aria-label="logo"
          title="Logo"
        >
          CVR
        </NavLink>
        <NavLink
          to="/blog"
          className={({ isActive }) =>
            cn(
              "block border-b-2 border-transparent leading-[3] text-[var(--fg)] duration-200 hover:text-[var(--highlight)]",
              {
                "border-[var(--highlight)]": isActive,
              },
            )
          }
          aria-label="blog"
          title="blog"
        >
          Blog
        </NavLink>
        <NavLink
          to="/about"
          className={({ isActive }) =>
            cn(
              "block border-b-2 border-transparent leading-[3] text-[var(--fg)] duration-200 hover:text-[var(--highlight)]",
              {
                "border-[var(--highlight)]": isActive,
              },
            )
          }
          aria-label="about"
          title="about"
        >
          About
        </NavLink>
        <NavLink
          to="/apps"
          className={({ isActive }) =>
            cn(
              "block border-b-2 border-transparent leading-[3] text-[var(--fg)] duration-200 hover:text-[var(--highlight)]",
              {
                "border-[var(--highlight)]": isActive,
              },
            )
          }
          aria-label="apps"
          title="apps"
        >
          Apps
        </NavLink>
      </div>
      {/* <form action="/theme" method="POST">
        <button className="switch" name="theme" value={theme === "dark" ? "light" : "dark"}>
          <LightSwitch aria-label="Toggle Theme" on={theme === "light"} />
        </button>
      </form> */}
    </nav>
  );
}
