type styles = {
  nav: string,
  logo: string,
  item: string,
  active: string,
  [@as "switch"]
  _switch: string,
};
[@module "./Nav.module.css"] external styles: styles = "default";

let storageKey = "__LIGHT";
let lightModeClassName = "light";

[@react.component]
let make = () => {
  let router = Next.Router.useRouter();
  let (lightMode, setLightMode) = React.useState(() => false);

  Hooks.useIsomorphicLayoutEffect0(() => {
    let lightModeOn = Document.bodyClassListContains(lightModeClassName);
    setLightMode(_ => lightModeOn);
    None;
  });

  let toggleTheme = (_event: ReactEvent.Mouse.t) => {
    let lightModeOn = Document.bodyClassListContains(lightModeClassName);
    let nextLightModeValue = !lightModeOn;

    setLightMode(_ => nextLightModeValue);
    LocalStorage.set(storageKey, Js.Json.boolean(nextLightModeValue));

    lightModeOn
      ? Document.bodyClassListRemove(lightModeClassName)
      : Document.bodyClassListAdd(lightModeClassName);
  };
  <>
    <Next.Head>
      <meta name="theme-color" content={lightMode ? "#0b7285" : "#fa8072"} />
    </Next.Head>
    <nav className={styles.nav}>
      <div>
        <Next.Link href="/">
          <a
            className=Cn.(
              styles.logo + styles.active->on(router.route === "/")
            )
            ariaLabel="logo"
            title="Logo">
            "CVR"->React.string
          </a>
        </Next.Link>
        <Next.Link href="/blog">
          <a
            className=Cn.(
              styles.item
              + styles.active->on(router.route->Js.String2.includes("blog"))
            )
            ariaLabel="blog"
            title="blog">
            "Blog"->React.string
          </a>
        </Next.Link>
      </div>
      <button className={styles._switch} onClick=toggleTheme>
        <LightSwitch ariaLabel="Toggle Theme" on=lightMode />
      </button>
    </nav>
  </>;
};
