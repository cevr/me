type styles = {
  nav: string,
  logo: string,
  [@as "switch"]
  _switch: string,
};
[@module "./Nav.module.css"] external styles: styles = "default";

let storageKey = "__LIGHT";
let lightModeClassName = "light";

[@react.component]
let make = () => {
  let (lightMode, setLightMode) = React.useState(() => false);

  React.useLayoutEffect0(() => {
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

  <nav className={styles.nav}>
    <Head>
      <meta name="theme-color" content={lightMode ? "#0b7285" : "#FF8C69"} />
    </Head>
    <div>
      <Next.Link href="/">
        <a className={styles.logo} ariaLabel="logo" title="Logo">
          "CVR"->React.string
        </a>
      </Next.Link>
    </div>
    <button className={styles._switch} onClick=toggleTheme>
      <LightSwitch ariaLabel="Toggle Theme" />
    </button>
  </nav>;
};
