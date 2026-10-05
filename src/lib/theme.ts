// A native head script must run during HTML parsing, before Next.js hydration.
// Keep this self-contained: it cannot depend on a downloaded JavaScript module.
export const THEME_INIT_SCRIPT = `(function(){var t;try{t=window.localStorage.getItem('theme')}catch(e){}if(t!=='light'&&t!=='dark'){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}document.documentElement.setAttribute('data-theme',t);document.documentElement.style.colorScheme=t})();`;
