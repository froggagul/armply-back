export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URL: string;
      GOOGLE_ID: string;
      GOOGLE_SECRET: string;
      PWD: string;
    }
  }
}