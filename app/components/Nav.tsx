import clsx from "clsx";
import { Link } from "remix";
import { useLocation } from "react-router-dom";

import { LightSwitch } from "./icons";

type NavProps = {
  colorMode: "light" | "dark";
};

export function Nav({ colorMode }: NavProps) {
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
      <form method="POST">
        <button
          className="switch"
          value={colorMode === "dark" ? "light" : "dark"}
        >
          <LightSwitch aria-label="Toggle Theme" on={colorMode === "light"} />
        </button>
      </form>
    </nav>
  );
}
