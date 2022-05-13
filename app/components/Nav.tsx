import clsx from "clsx";
import { useLocation } from "react-router-dom";
import { Link } from "remix";

import type { Theme } from "~/lib";

// import { LightSwitch } from "./icons";

type NavProps = {
  theme: Theme;
};

export function Nav({ theme }: NavProps) {
  let location = useLocation();

  return (
    <nav className="nav">
      <div>
        <Link
          to="/"
          className={clsx("logo", {
            active: location.pathname === "/",
          })}
          aria-label="logo"
          title="Logo"
        >
          CVR
        </Link>
        <Link
          to="/blog"
          className={clsx("item", {
            active: location.pathname.includes("blog"),
          })}
          aria-label="blog"
          title="blog"
        >
          Blog
        </Link>
      </div>
      {/* <form action="/theme" method="POST">
        <button className="switch" name="theme" value={theme === "dark" ? "light" : "dark"}>
          <LightSwitch aria-label="Toggle Theme" on={theme === "light"} />
        </button>
      </form> */}
    </nav>
  );
}
