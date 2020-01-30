(function() {
  const storageKey = '__LIGHT';
  const classNameLight = 'light';

  const preferLightQuery = '(prefers-color-scheme: light)';
  const mql = window.matchMedia(preferLightQuery);
  const supportsColorSchemeQuery = mql.media === preferLightQuery;
  let prefersLightMode = null;
  try {
    prefersLightMode = localStorage.getItem(storageKey);
  } catch (err) {}
  const localStorageExists = prefersLightMode !== null;
  if (localStorageExists) {
    prefersLightMode = JSON.parse(prefersLightMode);
  }

  if (prefersLightMode || (supportsColorSchemeQuery && mql.matches)) {
    document.body.classList.add(classNameLight);
  } else {
    localStorage.setItem(storageKey, JSON.stringify(false));
  }
})();
