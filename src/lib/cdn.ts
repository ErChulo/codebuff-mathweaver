import { TECH, type TechMeta } from "./types";

/**
 * Map<url, Promise<void>> cache. Allows multiple components to share the
 * same load promise for the same URL.
 */
const cache = new Map<string, Promise<void>>();

const TAG = (kind: "script" | "link", src: string) =>
  kind === "script"
    ? Object.assign(document.createElement("script"), {
        src,
        async: true,
        defer: true,
      })
    : Object.assign(document.createElement("link"), {
        rel: "stylesheet",
        href: src,
      });

function inject(url: string, kind: "script" | "link"): Promise<void> {
  const key = `${kind}:${url}`;
  if (cache.has(key)) return cache.get(key)!;

  // If a tag with this URL already exists, just resolve.
  const selector = kind === "script" ? `script[src="${url}"]` : `link[href="${url}"]`;
  if (document.querySelector(selector)) {
    const p = Promise.resolve();
    cache.set(key, p);
    return p;
  }

  const promise = new Promise<void>((resolve, reject) => {
    const el = TAG(kind, url) as HTMLScriptElement & HTMLLinkElement;
    el.onload = () => resolve();
    el.onerror = () => reject(new Error(`Failed to load ${url}`));
    document.head.appendChild(el);
  });

  cache.set(key, promise);
  return promise;
}

/**
 * Load all CDN assets required by a given technology (JavaScript + optional
 * CSS). Resolves with a no-op when nothing is required.
 */
export async function loadTech(type: TechMeta["type"]): Promise<void> {
  const meta = TECH[type];
  if (meta.cdnCss) await inject(meta.cdnCss, "link");
  if (meta.cdnJs) await inject(meta.cdnJs, "script");
}

/**
 * Pre-load a curated list of technologies at app boot. Used to amortize
 * the cost of CDN downloads across the first page a user lands on.
 */
export async function preloadTech(types: TechMeta["type"][]): Promise<void> {
  await Promise.all(types.map(loadTech));
}
