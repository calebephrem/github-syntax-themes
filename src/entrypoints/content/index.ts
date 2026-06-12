import { loadActiveTheme, watchActiveTheme } from "../../utils/themeStorage";
import { buildCSS } from "../../utils/parser";
import type { ThemeFile } from "../../types/theme";

export default defineContentScript({
  matches: ["https://github.com/*", "https://gist.github.com/*"],
  runAt: "document_start",

  async main() {
    const stored = await loadActiveTheme();
    if (stored) applyTheme(stored.theme);

    watchActiveTheme((newValue) => {
      if (newValue) {
        applyTheme(newValue.theme);
      } else {
        clearTheme();
      }
    });

    document.addEventListener("turbo:render", () => {
      loadActiveTheme().then((stored) => {
        if (stored) applyTheme(stored.theme);
      });
    });

    chrome.runtime.onMessage.addListener((msg) => {
      if (msg.type === "INJECT_CSS" && msg.css) {
        injectStyleTag(msg.css);
      } else if (msg.type === "CLEAR_CSS") {
        clearTheme();
      }
    });
  },
});

const STYLE_ID = "github-syntax-themes";

function injectStyleTag(css: string) {
  let tag = document.getElementById(STYLE_ID) as HTMLStyleElement | null;
  if (!tag) {
    tag = document.createElement("style");
    tag.id = STYLE_ID;

    (document.head ?? document.documentElement).appendChild(tag);
  }
  tag.textContent = css;
}

function clearTheme() {
  document.getElementById(STYLE_ID)?.remove();
}

function applyTheme(theme: ThemeFile) {
  const css = buildCSS(theme);
  injectStyleTag(css);
}
