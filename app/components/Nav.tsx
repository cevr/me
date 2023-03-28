import { NavLink } from "@remix-run/react";

import { cn } from "~/lib/utils/cn";

// import { LightSwitch } from "./icons";

export function Nav() {
  return (
    <nav className="grid grid-cols-[10rem,1fr] gap-5 md:gap-2 items-center z-10 transition-colors">
      <div className="flex items-end gap-4">
        <NavLink
          to="/"
          className={({ isActive }) =>
            cn(
              "text-[2.5rem] font-[Megrim] text-[var(--fg)] border-b-2 border-transparent hover:text-[var(--highlight)] transition-colors",
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
              "block text-[var(--fg)] duration-200 border-b-2 border-transparent leading-[3] hover:text-[var(--highlight)]",
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
              "block text-[var(--fg)] duration-200 border-b-2 border-transparent leading-[3] hover:text-[var(--highlight)]",
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
      </div>
      {/* <form action="/theme" method="POST">
        <button className="switch" name="theme" value={theme === "dark" ? "light" : "dark"}>
          <LightSwitch aria-label="Toggle Theme" on={theme === "light"} />
        </button>
      </form> */}
    </nav>
  );
}
