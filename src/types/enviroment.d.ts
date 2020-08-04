export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URL: string;
      GOOGLE_ID: string;
      GOOGLE_SECRET: string;
      FACEBOOK_ID: string;
      FACEBOOK_SECRET: string;
      FRONT_URL: string;
      PWD: string;
    }
  }
}