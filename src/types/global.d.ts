declare global {
  interface Window {
    navigateToAuth: (redirectUrl: string) => void;
    katex: typeof import("katex") extends never ? unknown : never;
    mermaid: unknown;
    JXG: unknown;
    aq: unknown;
    Plotly: unknown;
    mathbox: unknown;
  }
}

export {};
