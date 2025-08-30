declare global {
  namespace NodeJS {
    interface ProcessEnv {
      HUDL_EMAIL: string;
      HUDL_PASSWORD: string;
    }
  }
}

export {};
