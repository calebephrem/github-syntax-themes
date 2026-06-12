import { storage } from "@wxt-dev/storage";
import type { StoredActiveTheme } from "../types/theme";

const ACTIVE_THEME_KEY = "local:activeTheme" as const;

export async function saveActiveTheme(data: StoredActiveTheme): Promise<void> {
  await storage.setItem<StoredActiveTheme>(ACTIVE_THEME_KEY, data);
}

export async function loadActiveTheme(): Promise<StoredActiveTheme | null> {
  return storage.getItem<StoredActiveTheme>(ACTIVE_THEME_KEY);
}

export async function clearActiveTheme(): Promise<void> {
  await storage.removeItem(ACTIVE_THEME_KEY);
}

export function watchActiveTheme(
  callback: (newValue: StoredActiveTheme | null) => void,
): () => void {
  return storage.watch<StoredActiveTheme>(ACTIVE_THEME_KEY, callback);
}
