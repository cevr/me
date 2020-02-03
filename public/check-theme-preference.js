(function() {
  let lightColorScheme = window.matchMedia('(prefers-color-scheme: light)');
  let prefersLightMode = JSON.parse(localStorage.getItem('__LIGHT'));
  if ((prefersLightMode === null && lightColorScheme.matches) || prefersLightMode) {
    document.body.classList.add('light');
  }
})();
