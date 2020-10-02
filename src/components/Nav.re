type styles = {
  nav: string,
  logo: string,
  [@as "switch"]
  _switch: string,
};
[@module "./Nav.module.css"] external styles: styles = "default";

[@react.component]
let make = (~toggleTheme, ~lightMode) => {
  <nav className={styles.nav}>
    <div>
      <Next.Link href="/">
        <a className={styles.logo} ariaLabel="logo" title="Logo">
          "CVR"->React.string
        </a>
      </Next.Link>
    </div>
    <button className={styles._switch} onClick=toggleTheme>
      <LightSwitch ariaLabel="Toggle Theme" on=lightMode />
    </button>
  </nav>;
};
