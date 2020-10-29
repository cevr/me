import React from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import clsx from "clsx";

import { useIsomorphicLayoutEffect } from "../shared";
import { LightSwitch } from "./icons";
import styles from "./Nav.module.css";

let storageKey = "__LIGHT";
let lightModeClassName = "light";

function Nav() {
  let router = useRouter();
  let [lightMode, setLightMode] = React.useState(false);

  useIsomorphicLayoutEffect(() => {
    let lightModeOn = document.body.classList.contains(lightModeClassName);
    setLightMode(lightModeOn);
  });

  let toggleTheme = (_event: React.MouseEvent) => {
    let lightModeOn = document.body.classList.contains(lightModeClassName);
    let nextLightModeValue = !lightModeOn;

    setLightMode(nextLightModeValue);
    localStorage.set(storageKey, JSON.stringify(nextLightModeValue));

    lightModeOn
      ? document.body.classList.remove(lightModeClassName)
      : document.body.classList.add(lightModeClassName);
  };

  return (
    <>
      <Head>
        <meta name="theme-color" content={lightMode ? "#0b7285" : "#fa8072"} />
      </Head>
      <nav className={styles.nav}>
        <div>
          <Link href="/">
            <a
              className={clsx(styles.logo, {
                [styles.active]: router.route === "/",
              })}
              aria-label="logo"
              title="Logo"
            >
              CVR
            </a>
          </Link>
          <Link href="/blog">
            <a
              className={clsx(styles.item, {
                [styles.active]: router.route.includes("blog"),
              })}
              aria-label="blog"
              title="blog"
            >
              Blog
            </a>
          </Link>
        </div>
        <button className={styles.switch} onClick={toggleTheme}>
          <LightSwitch aria-label="Toggle Theme" on={lightMode} />
        </button>
      </nav>
    </>
  );
}

export default Nav;
