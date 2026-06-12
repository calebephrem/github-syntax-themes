import type { FullTheme, ThemeFile } from "../types/theme";

const REPO_BASE =
  "https://raw.githubusercontent.com/calebephrem/github-syntax-theme-store/main/themes";

export async function getTheme(fileName: string): Promise<FullTheme | null> {
  const url = `${REPO_BASE}/${fileName}.json`;

  let res: Response;
  try {
    res = await fetch(url);
  } catch {
    return null;
  }

  if (!res.ok) return null;

  let data: ThemeFile;
  try {
    data = await res.json();
  } catch {
    return null;
  }

  // Validate required fields per schema
  if (!data.name || !data.author || !data.type) return null;

  return { ...data, fileName };
}
