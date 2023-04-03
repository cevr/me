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
              "border-b-2 border-transparent font-[Signerica] text-[2.5rem] text-neutral-50 transition-colors hover:text-salmon-500",
              { "border-salmon-500": isActive },
            )
          }
          aria-label="logo"
          title="Logo"
        >
          cvr
        </NavLink>
        <NavLink
          to="/blog"
          className={({ isActive }) =>
            cn("block border-b-2 border-transparent leading-[3] text-neutral-50 duration-200 hover:text-salmon-500", {
              "border-salmon-500": isActive,
            })
          }
          aria-label="blog"
          title="blog"
        >
          Blog
        </NavLink>
        <NavLink
          to="/apps"
          className={({ isActive }) =>
            cn("block border-b-2 border-transparent leading-[3] text-neutral-50 duration-200 hover:text-salmon-500", {
              "border-salmon-500": isActive,
            })
          }
          aria-label="apps"
          title="apps"
        >
          Apps
        </NavLink>
        <NavLink
          to="/about"
          className={({ isActive }) =>
            cn("block border-b-2 border-transparent leading-[3] text-neutral-50 duration-200 hover:text-salmon-500", {
              "border-salmon-500": isActive,
            })
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
