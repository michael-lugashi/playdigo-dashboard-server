declare namespace NodeJS {
  interface ProcessEnv {
    EMAIL: string;
    HASHED_PASSWORD: string;
    JWT_AUTH_TOKEN_SECRET: string;
    NODE_ENV: 'development' | 'production';
    PORT: string;
  }
}
