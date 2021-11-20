import * as React from "react";
import clsx from "clsx";
import { Link } from "remix";
import { useLocation } from "react-router-dom";

import { LightSwitch } from "./icons";
import { COLOR_MODE_KEY } from "~/lib/constants";

let lightModeClassName = "light";

export function Nav() {
  let location = useLocation();
  let [lightMode, setLightMode] = React.useState(() => {
    try {
      return document.body.classList.contains(lightModeClassName);
    } catch {
      return false;
    }
  });

  let toggleTheme = () => {
    let lightModeOn = document.body.classList.contains(lightModeClassName);
    let nextLightModeValue = !lightModeOn;

    setLightMode(nextLightModeValue);
    localStorage.setItem(COLOR_MODE_KEY, lightModeOn ? "light" : "dark");

    lightModeOn
      ? document.body.classList.remove(lightModeClassName)
      : document.body.classList.add(lightModeClassName);
  };

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
      <button className="switch" onClick={toggleTheme}>
        <LightSwitch aria-label="Toggle Theme" on={lightMode} />
      </button>
    </nav>
  );
}
