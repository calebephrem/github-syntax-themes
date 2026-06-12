import { useState, useRef } from "react";
import {
  Search,
  Loader2,
  Palette,
  ChevronLeft,
  Check,
  AlertTriangle,
  Moon,
  Sun,
} from "lucide-react";
import type { ThemeSearchResult, FullTheme } from "../../types/theme";
import { searchThemes } from "../../utils/searchThemes";
import { getTheme } from "../../utils/getTheme";
import { saveActiveTheme } from "../../utils/themeStorage";

type View = { screen: "search" } | { screen: "detail"; theme: FullTheme };

export default function App() {
  const [view, setView] = useState<View>({ screen: "search" });

  return (
    <div className="w-[340px] min-h-[400px] flex flex-col overflow-hidden bg-[#0d1117] text-[#e6edf3] font-sans antialiased">
      {view.screen === "search" && (
        <SearchScreen
          onSelect={(theme) => setView({ screen: "detail", theme })}
        />
      )}
      {view.screen === "detail" && (
        <DetailScreen
          theme={view.theme}
          onBack={() => setView({ screen: "search" })}
        />
      )}
    </div>
  );
}

function SearchScreen({ onSelect }: { onSelect: (theme: FullTheme) => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ThemeSearchResult[] | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "empty" | "error">(
    "idle",
  );
  const [loadingSlug, setLoadingSlug] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleSearch() {
    const q = query.trim();
    if (!q) return;
    setStatus("loading");
    setResults(null);
    try {
      const res = await searchThemes(q);
      setStatus(res && res.length > 0 ? "idle" : "empty");
      if (res) setResults(res);
    } catch {
      setStatus("error");
    }
  }

  async function handleSelect(result: ThemeSearchResult) {
    setLoadingSlug(result.fileName);
    try {
      const full = await getTheme(result.fileName);
      if (full) onSelect(full);
    } finally {
      setLoadingSlug(null);
    }
  }

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <header className="flex items-center gap-2 px-3.5 py-3 border-b border-[#21262d] bg-[#161b22] shrink-0">
        <GithubIcon />
        <span className="text-[13px] font-semibold text-[#e6edf3] tracking-[0.01em]">
          Browse Themes
        </span>
      </header>

      <div className="flex gap-1.5 px-3 py-2.5 border-b border-[#21262d] bg-[#0d1117] shrink-0">
        <div className="relative flex-1">
          <input
            ref={inputRef}
            type="text"
            placeholder="Search themes…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            autoFocus
            className="w-full h-[30px] px-2.5 rounded-md border border-[#30363d] bg-[#161b22] text-[#e6edf3] text-[12px] placeholder-[#484f58] outline-none focus:border-[#388bfd] focus:shadow-[0_0_0_3px_rgba(56,139,253,0.15)] transition-all"
          />
        </div>
        <button
          onClick={handleSearch}
          disabled={status === "loading"}
          className="w-[30px] h-[30px] shrink-0 flex items-center justify-center rounded-md border border-[#30363d] bg-[#21262d] text-[#8b949e] hover:bg-[#30363d] hover:text-[#e6edf3] disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          {status === "loading" ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin text-[#388bfd]" />
          ) : (
            <Search className="w-3.5 h-3.5" />
          )}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-2 scrollbar-thin scrollbar-thumb-[#30363d] scrollbar-track-transparent">
        {status === "idle" && results === null && (
          <p className="px-4 py-6 text-center text-[12px] text-[#8b949e]">
            Search for a theme by name to get started.
          </p>
        )}
        {status === "empty" && (
          <p className="px-4 py-6 text-center text-[12px] text-[#484f58]">
            No themes found for &ldquo;{query}&rdquo;.
          </p>
        )}
        {status === "error" && (
          <div className="flex items-center justify-center gap-2 px-4 py-6 text-center text-[12px] text-[#f85149]">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Failed to fetch themes. Check your connection.</span>
          </div>
        )}

        {results && results.length > 0 && (
          <ul className="flex flex-col gap-1 px-2">
            {results.map((r) => (
              <li key={r.fileName}>
                <button
                  onClick={() => handleSelect(r)}
                  disabled={loadingSlug !== null}
                  className="w-full flex items-start gap-2.5 p-2.5 rounded-lg border border-[#21262d] bg-[#161b22] text-left hover:border-[#388bfd55] hover:bg-[#1c2128] disabled:opacity-70 disabled:cursor-default transition-all relative cursor-pointer"
                >
                  <div className="w-9 h-9 shrink-0 rounded-md bg-[#21262d] flex items-center justify-center overflow-hidden text-[#8b949e]">
                    {r.icon ? (
                      <img
                        src={r.icon}
                        alt={r.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Palette className="w-4 h-4" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[13px] font-semibold text-[#e6edf3]">
                        {r.name}
                      </span>
                      <TypeBadge type={r.type} />
                    </div>
                    <span className="text-[11px] text-[#8b949e]">
                      @{r.author}
                    </span>
                    {r.description && (
                      <p className="text-[11px] text-[#8b949e] leading-snug line-clamp-2">
                        {r.description}
                      </p>
                    )}
                  </div>

                  {loadingSlug === r.fileName && (
                    <div className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#388bfd]">
                      <Loader2 className="w-4 h-4 animate-spin" />
                    </div>
                  )}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function DetailScreen({
  theme,
  onBack,
}: {
  theme: FullTheme;
  onBack: () => void;
}) {
  const [applyState, setApplyState] = useState<
    "idle" | "applying" | "applied" | "error"
  >("idle");

  const swatchEntries = Object.entries(theme.syntaxHighlighting ?? {}).slice(
    0,
    12,
  );

  async function handleApply() {
    setApplyState("applying");
    try {
      const data = { fileName: theme.fileName, theme };
      await saveActiveTheme(data);
      await chrome.storage.local.set({ "local:activeTheme": data });
      setApplyState("applied");
    } catch (err) {
      console.error("[theme-browser] handleApply failed:", err);
      setApplyState("error");
    }
  }

  const applyBtnClass =
    applyState === "idle"
      ? "bg-[#238636] hover:bg-[#2ea043] text-white"
      : applyState === "applying"
        ? "bg-[#1f6feb] text-white cursor-not-allowed"
        : applyState === "applied"
          ? "bg-[#1a7f37] text-white cursor-not-allowed"
          : "bg-[#da3633] hover:bg-[#f85149] text-white";

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <header className="flex items-center px-3 py-2 border-b border-[#21262d] bg-[#161b22] shrink-0">
        <button
          onClick={onBack}
          aria-label="Go back"
          className="flex items-center gap-1 px-1.5 py-1 rounded-md text-[#8b949e] text-[12px] hover:text-[#e6edf3] hover:bg-[#21262d] transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>Back</span>
        </button>
      </header>

      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-[#30363d] scrollbar-track-transparent">
        <div className="flex items-center gap-3 px-3.5 pt-4 pb-3">
          <div className="w-[52px] h-[52px] shrink-0 rounded-xl bg-[#21262d] flex items-center justify-center overflow-hidden text-[#8b949e]">
            {theme.icon ? (
              <img
                src={theme.icon}
                alt={theme.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <Palette className="w-7 h-7" />
            )}
          </div>
          <div className="flex flex-col gap-1 min-w-0">
            <h1 className="text-[15px] font-bold text-[#e6edf3] leading-tight truncate">
              {theme.name}
            </h1>
            <button
              onClick={() =>
                window.open(
                  `https://github.com/${theme.author}`,
                  "_blank",
                  "noopener,noreferrer",
                )
              }
              className="text-[11px] text-[#8b949e] text-left hover:underline bg-transparent border-none p-0 cursor-pointer w-fit block truncate"
            >
              by @{theme.author}
            </button>
            <TypeBadge type={theme.type} />
          </div>
        </div>

        {theme.description && (
          <p className="px-3.5 pb-4 text-[12px] text-[#8b949e] leading-relaxed">
            {theme.description}
          </p>
        )}
      </div>

      <div className="shrink-0 bg-[#0d1117] flex flex-col">
        {swatchEntries.length > 0 && (
          <div className="flex flex-wrap gap-1.5 px-3.5 pb-3 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {swatchEntries.map(([key, color]) => (
              <div
                key={key}
                className="w-5 h-5 rounded-[4px] border border-white/10 shrink-0 relative group cursor-help"
                style={{ backgroundColor: color }}
              >
                <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 opacity-0 group-hover:opacity-100 transition-opacity bg-[#161b22] border border-[#30363d] text-[10px] text-[#e6edf3] px-1.5 py-0.5 rounded whitespace-nowrap z-10 shadow-xl">
                  {key}: {color}
                </span>
              </div>
            ))}
          </div>
        )}

        <div className="border-t border-[#21262d] w-full" />

        <div className="px-3.5 pt-3 pb-4">
          <button
            onClick={handleApply}
            disabled={applyState === "applying" || applyState === "applied"}
            className={`w-full h-[34px] rounded-lg text-[13px] font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${applyBtnClass}`}
          >
            {applyState === "idle" && "Apply Theme"}
            {applyState === "applying" && (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" /> Applying…
              </>
            )}
            {applyState === "applied" && (
              <>
                <Check className="w-3.5 h-3.5" /> Applied!
              </>
            )}
            {applyState === "error" && "Retry"}
          </button>
        </div>
      </div>
    </div>
  );
}

function TypeBadge({ type }: { type: "light" | "dark" }) {
  return (
    <span
      className={`text-[10px] font-medium px-1.5 py-[1px] rounded-full leading-relaxed whitespace-nowrap flex items-center gap-1 border w-fit ${
        type === "dark"
          ? "bg-[#1f2937] text-[#93c5fd] border-[#1d3452]"
          : "bg-[#fefce8] text-[#854d0e] border-[#fde68a]"
      }`}
    >
      {type === "dark" ? (
        <Moon className="w-2.5 h-2.5" />
      ) : (
        <Sun className="w-2.5 h-2.5" />
      )}
      <span className="capitalize">{type}</span>
    </span>
  );
}

function GithubIcon() {
  return (
    <svg viewBox="0 0 16 16" className="w-4 h-4 shrink-0" fill="currentColor">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
    </svg>
  );
}
