import type { ThemeFile } from "../types/theme";

const PRETTYLIGHTS_VAR_MAP: Record<string, string> = {
  comment: "--color-prettylights-syntax-comment",
  meta: "--color-prettylights-syntax-comment",

  constant: "--color-prettylights-syntax-constant",
  constantNumeric: "--color-prettylights-syntax-constant",
  constantBuiltin: "--color-prettylights-syntax-constant",

  keyword: "--color-prettylights-syntax-keyword",
  keywordControl: "--color-prettylights-syntax-keyword",
  keywordOperator: "--color-prettylights-syntax-keyword",

  string: "--color-prettylights-syntax-string",
  stringSpecial: "--color-prettylights-syntax-string",
  attributeValue: "--color-prettylights-syntax-string",
  stringRegexp: "--color-prettylights-syntax-string-regexp",

  variable: "--color-prettylights-syntax-variable",
  variableParameter: "--color-prettylights-syntax-variable",
  variableBuiltin: "--color-prettylights-syntax-variable",

  functionName: "--color-prettylights-syntax-entity",
  functionCall: "--color-prettylights-syntax-entity",
  functionBuiltin: "--color-prettylights-syntax-entity",
  typeName: "--color-prettylights-syntax-entity",
  typeBuiltin: "--color-prettylights-syntax-entity",
  decorator: "--color-prettylights-syntax-entity",

  namespace: "--color-prettylights-syntax-storage-modifier-import",

  tag: "--color-prettylights-syntax-entity-tag",
  attribute: "--color-prettylights-syntax-entity-tag",

  markupHeading: "--color-prettylights-syntax-markup-heading",
  markupBold: "--color-prettylights-syntax-markup-bold",
  markupItalic: "--color-prettylights-syntax-markup-italic",
  markupList: "--color-prettylights-syntax-markup-list",

  invalid: "--color-prettylights-syntax-invalid-illegal-text",
  deprecated: "--color-prettylights-syntax-invalid-illegal-text",

  diffInserted: "--color-prettylights-syntax-markup-inserted-text",
  diffDeleted: "--color-prettylights-syntax-markup-deleted-text",
};

const PL_CLASS_MAP: Record<string, string> = {
  comment: ".pl-c",
  meta: ".pl-c",

  constant: ".pl-c1",
  constantNumeric: ".pl-c1",
  constantBuiltin: ".pl-c1, .pl-smi",

  keyword: ".pl-k",
  keywordControl: ".pl-k",
  keywordOperator: ".pl-k",
  operator: ".pl-kos",

  string: ".pl-s, .pl-pds",
  stringRegexp: ".pl-sr",
  stringEscape: ".pl-cce",
  stringSpecial: ".pl-s .pl-pds",

  variable: ".pl-v",
  variableParameter: ".pl-smi",
  variableBuiltin: ".pl-smi",

  functionName: ".pl-en",
  functionCall: ".pl-en",
  functionBuiltin: ".pl-en",

  typeName: ".pl-e, .pl-smi",
  typeBuiltin: ".pl-e",
  typeAnnotation: ".pl-e",
  namespace: ".pl-e",

  attribute: ".pl-e",
  attributeValue: ".pl-s",

  tag: ".pl-ent",
  tagPunctuation: ".pl-kos",

  decorator: ".pl-c1",
  punctuation: ".pl-kos",
  bracket: ".pl-kos",
  property: ".pl-v",

  cssProperty: ".pl-e, .pl-smi",
  cssValue: ".pl-s",
  cssUnit: ".pl-c1",
  cssSelector: ".pl-ent",
  cssPseudo: ".pl-c1",

  markupHeading: ".pl-mh, .pl-mh .pl-en",
  markupBold: ".pl-mb",
  markupItalic: ".pl-mi",
  markupCode: ".pl-ms",
  markupLink: ".pl-mr",
  markupLinkUrl: ".pl-mr",
  markupQuote: ".pl-mq",
  markupList: ".pl-ml",

  diffInserted: ".pl-mi1",
  diffDeleted: ".pl-md",

  invalid: ".pl-ii",
  deprecated: ".pl-ii",
};

export function buildCSS(theme: ThemeFile): string {
  const parts: string[] = [];
  parts.push(buildSyntaxVariables(theme));
  parts.push(buildSyntaxClassOverrides(theme));
  return parts.filter(Boolean).join("\n\n");
}

function buildSyntaxVariables(theme: ThemeFile): string {
  const syn = theme.syntaxHighlighting ?? {};
  const lines: string[] = [];
  const seen = new Set<string>();

  for (const [key, cssVar] of Object.entries(PRETTYLIGHTS_VAR_MAP)) {
    const value = syn[key];
    if (!value || seen.has(cssVar)) continue;
    seen.add(cssVar);
    lines.push(`  ${cssVar}: ${value} !important;`);
  }

  return lines.length ? `:root {\n${lines.join("\n")}\n}` : "";
}

function buildSyntaxClassOverrides(theme: ThemeFile): string {
  const syn = theme.syntaxHighlighting ?? {};
  const lines: string[] = [];
  const seen = new Map<string, string>();

  for (const [key, selector] of Object.entries(PL_CLASS_MAP)) {
    const value = syn[key];
    if (!value || seen.get(selector) === value) continue;
    seen.set(selector, value);
    lines.push(`${selector} { color: ${value} !important; }`);
  }

  return lines.length ? "\n" + lines.join("\n") : "";
}
