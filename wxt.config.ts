import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "wxt";

export default defineConfig({
  modules: ["@wxt-dev/module-react"],
  srcDir: "src",
  outDir: "dist",

  vite: () => ({
    plugins: [tailwindcss()],
  }),

  manifest: {
    name: "GitHub Syntax Themes",
    description:
      "A collection of syntax themes for GitHub's code blocks, gists, and markdown code snippets.",
    version: "1.0.0",
    action: {
      default_title: "GitHub Syntax Themes",
      default_icon: {
        "16": "icons/icon-16.png",
        "32": "icons/icon-32.png",
        "48": "icons/icon-48.png",
        "64": "icons/icon-64.png",
        "128": "icons/icon-128.png",
        "256": "icons/icon-256.png",
        "512": "icons/icon-512.png",
      },
      default_popup: "popup/index.html",
    },

    permissions: ["storage", "tabs"],

    host_permissions: ["https://*.github.com/*"],
  },
});
