import type { ThemeFile, ThemeSearchResult } from "../types/theme";

const REPO_BASE =
  "https://raw.githubusercontent.com/calebephrem/github-syntax-theme-store/main/themes";

const REPO_API =
  "https://api.github.com/repos/calebephrem/github-syntax-theme-store/contents/themes";

export async function searchThemes(
  query: string,
): Promise<ThemeSearchResult[] | null> {
  const normalised = query.trim().toLowerCase();
  if (!normalised) return null;

  const listRes = await fetch(REPO_API, {
    headers: { Accept: "application/vnd.github+json" },
  });

  if (!listRes.ok) {
    throw new Error(
      `GitHub API error ${listRes.status}: ${listRes.statusText}`,
    );
  }

  const entries: { name: string; type: string }[] = await listRes.json();

  const matchingFiles = entries
    .filter(
      (e) =>
        e.type === "file" &&
        e.name.endsWith(".json") &&
        e.name.toLowerCase().replace(".json", "").includes(normalised),
    )
    .map((e) => e.name.replace(".json", ""));

  if (matchingFiles.length === 0) return null;

  const results = await Promise.allSettled(
    matchingFiles.map((fileName) => fetchThemeMeta(fileName)),
  );

  const themes: ThemeSearchResult[] = [];
  for (const r of results) {
    if (r.status === "fulfilled" && r.value) {
      themes.push(r.value);
    }
  }

  return themes.length === 0 ? null : themes;
}

// will fetch a single theme file and returns only the fields needed for search results
async function fetchThemeMeta(
  fileName: string,
): Promise<ThemeSearchResult | null> {
  const url = `${REPO_BASE}/${fileName}.json`;
  const res = await fetch(url);
  if (!res.ok) return null;

  const data: ThemeFile = await res.json();

  if (!data.name || !data.author || !data.type) return null;

  return {
    fileName,
    name: data.name,
    description: data.description,
    author: data.author,
    type: data.type,
    icon: data.icon,
  };
}
