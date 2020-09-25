type styles = {
  nav: string,
  logo: string,
  [@as "switch"]
  _switch: string,
};
[@module "./Nav.module.css"] external styles: styles = "default";

let storageKey = "__LIGHT";
let lightModeClassName = "light";

let toggleTheme = (_event: ReactEvent.Mouse.t) => {
  let lightModeOn = Document.bodyClassListContains(lightModeClassName);
  let nextLightModeValue = Js.Json.boolean(!lightModeOn);

  LocalStorage.set(storageKey, nextLightModeValue);

  lightModeOn
    ? Document.bodyClassListRemove(lightModeClassName)
    : Document.bodyClassListAdd(lightModeClassName);
};

[@react.component]
let make = () =>
  <nav className={styles.nav}>
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
