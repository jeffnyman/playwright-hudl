declare global {
  namespace NodeJS {
    interface ProcessEnv {
      HUDL_EMAIL: string;
      HUDL_PASSWORD: string;
      HUDL_DISPLAY_NAME: string;
    }
  }
}

export {};
