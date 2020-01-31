(function() {
  let storageKey = '__LIGHT';
  let lightModeClassName = 'light';
  let preferLightQuery = '(prefers-color-scheme: light)';
  let mql = window.matchMedia(preferLightQuery);
  let prefersColorSchemeLight = mql.matches;
  let prefersLightMode = prefersColorSchemeLight;
  try {
    prefersLightMode = JSON.parse(localStorage.getItem(storageKey));
  } catch (err) {}
  if (prefersLightMode) {
    document.body.classList.add(lightModeClassName);
  }
  if (mql.addListener) {
    mql.addListener(({ matches }) => {
      let prefersLightMode = JSON.parse(localStorage.getItem(storageKey));
      if (prefersLightMode !== null) return;
      matches
        ? document.body.classList.add(lightModeClassName)
        : document.body.classList.remove(lightModeClassName);
    });
  }
})();
