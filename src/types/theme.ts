export interface ThemeFile {
  $schema?: string;
  name: string;
  description?: string;
  author: string;
  type: "light" | "dark";
  icon?: string;
  ui?: Record<string, string>;
  syntaxHighlighting?: Record<string, string>;
}

export interface ThemeSearchResult {
  fileName: string;
  name: string;
  description?: string;
  author: string;
  type: "light" | "dark";
  icon?: string;
}

export type FullTheme = ThemeFile & { fileName: string };

export interface StoredActiveTheme {
  fileName: string;
  theme: ThemeFile;
}
