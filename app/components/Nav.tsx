import clsx from "clsx";
import { NavLink } from "remix";

// import { LightSwitch } from "./icons";

export function Nav() {
  return (
    <nav className="nav">
      <div>
        <NavLink to="/" className={({ isActive }) => clsx("logo", { active: isActive })} aria-label="logo" title="Logo">
          CVR
        </NavLink>
        <NavLink
          to="/blog"
          className={({ isActive }) => clsx("item", { active: isActive })}
          aria-label="blog"
          title="blog"
        >
          Blog
        </NavLink>
        <NavLink
          to="/about"
          className={({ isActive }) => clsx("item", { active: isActive })}
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
