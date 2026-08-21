/**
 * Lightweight branding bridge for Zombie Hunter — no build step, plain JS.
 * Re-skins the game's own existing chrome in place (HUD pill borders/accent
 * text color, page title) instead of replacing any UI. See
 * ../../BRANDING_CONTRACT.md and ../shared/start-screen/README.md.
 *
 * This game has no start/menu screen of its own (it boots straight into
 * play), so there's no natural heading/logo slot to re-skin — only the
 * color accents on the persistent HUD chrome and the document title.
 */
(function () {
  var DEFAULT_THEME = {
    primaryColor: "#ffffff",
    secondaryColor: "#ffffff",
    accentColor: "#ffd700",
    logoUrl: null,
    brandName: "",
    heading: "Zombie Hunter",
    tagline: "",
  };

  window.__BRAND__ = Object.assign({}, DEFAULT_THEME);

  function applyTheme(theme) {
    window.__BRAND__ = Object.assign({}, window.__BRAND__, theme);
    var root = document.documentElement;
    root.style.setProperty("--brand-primary", window.__BRAND__.primaryColor);
    root.style.setProperty("--brand-secondary", window.__BRAND__.secondaryColor);
    root.style.setProperty("--brand-accent", window.__BRAND__.accentColor);
    // No on-screen heading/logo slot exists in this game (it boots straight
    // into play), so the brand name/title surface only through the tab title.
    if (window.__BRAND__.heading) {
      document.title = window.__BRAND__.brandName
        ? window.__BRAND__.brandName + " — " + window.__BRAND__.heading
        : window.__BRAND__.heading;
    }
  }

  function themeFromQueryParams() {
    var params = new URLSearchParams(window.location.search);
    var theme = {};
    var hex = /^#[0-9a-fA-F]{6}$/;
    if (params.has("brandName")) theme.brandName = params.get("brandName") || "";
    if (params.has("heading")) theme.heading = params.get("heading") || DEFAULT_THEME.heading;
    if (params.has("tagline")) theme.tagline = params.get("tagline") || "";
    if (params.has("logo")) theme.logoUrl = params.get("logo");
    var primary = params.get("primaryColor");
    var secondary = params.get("secondaryColor");
    var accent = params.get("accentColor");
    if (primary && hex.test(primary)) theme.primaryColor = primary;
    if (secondary && hex.test(secondary)) theme.secondaryColor = secondary;
    if (accent && hex.test(accent)) theme.accentColor = accent;
    return theme;
  }

  window.addEventListener("message", function (event) {
    if (event.data && event.data.type === "CDH_BRAND_UPDATE") {
      applyTheme(event.data.theme || {});
    }
  });

  applyTheme({});
  applyTheme(themeFromQueryParams());
  if (window.parent && window.parent !== window) {
    window.parent.postMessage({ type: "CDH_BRAND_READY" }, "*");
  }
})();
