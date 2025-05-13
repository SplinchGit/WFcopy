/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_WORLD_APP_ID: string;
  readonly VITE_WORLD_ACTION_ID: string;
  readonly VITE_DATABASE_URL: string;
  readonly VITE_JWT_SECRET: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
