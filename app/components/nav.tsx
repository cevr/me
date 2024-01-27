import { NavLink } from "@remix-run/react";

import { cn } from "~/lib/utils/cn";

// import { LightSwitch } from "./icons";

export function Nav() {
  return (
    <nav className="font-mono z-10 grid grid-cols-[auto,1fr] items-end gap-6 transition-colors h-16">
      <NavLink
        to="/"
        className={({ isActive }) =>
          cn(
            "border-b-2 border-transparent font-[Signerica] text-[2.5rem] text-neutral-50 transition-colors hover:text-salmon-500 w-[110px]",
            { "border-salmon-500": isActive },
          )
        }
        aria-label="logo"
        title="Logo"
      >
        cvr
      </NavLink>
      <div className="flex justify-start items-end">
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
