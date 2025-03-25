declare namespace NodeJS {
  interface ProcessEnv {
    EMAIL: string;
    HASHED_PASSWORD: string;
    JWT_AUTH_TOKEN_SECRET: string;
    PORT: string;
  }
}
