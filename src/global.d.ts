declare namespace NodeJS {
   interface ProcessEnv {
      BASE_API_URL: string;
      CLIENT_TOKEN: string;
      CLIENT_USER_TOKEN: string;
      DEFAULT_CLIENT_NICKNAME: string;
      DEFAULT_CLIENT_PICTURE: string;
      DEFAULT_ROOM_NAME: string;
      DEFAULT_CHAT_COLOR: string;
      SERVER_PORT: string;
      ENV: 'dev' | 'prod';
      DATABASE_URL: string;
   }
}
