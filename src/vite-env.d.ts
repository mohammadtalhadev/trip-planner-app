/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GEOAPIFY_KEY?: string;
  readonly VITE_OPENTRIPMAP_KEY?: string;
  readonly VITE_PEXELS_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
