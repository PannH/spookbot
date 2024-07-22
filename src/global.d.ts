declare namespace NodeJS {
   interface ProcessEnv {
      BASE_API_URL: string;
      CLIENT_TOKEN: string;
      CLIENT_USER_TOKEN: string;
      DEFAULT_CLIENT_NICKNAME: string;
      DEFAULT_CLIENT_PICTURE: string;
      SERVER_PORT: string;
      DATABASE_URL: string;
   }
}
