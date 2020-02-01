(function() {
  let storageKey = '__LIGHT';
  let lightModeClassName = 'light';
  let mql = window.matchMedia('(prefers-color-scheme: light)');
  let prefersColorSchemeLight = mql.matches;
  let prefersLightMode = prefersColorSchemeLight;
  try {
    prefersLightMode = JSON.parse(localStorage.getItem(storageKey));
  } catch (err) {}
  if ((prefersLightMode !== null && prefersLightMode) || prefersColorSchemeLight) {
    document.body.classList.add(lightModeClassName);
  }
})();
