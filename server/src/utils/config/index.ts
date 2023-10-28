import { validateUtil } from './validation';
import { AppEnvironmentVariables } from './variables';

export default () => {
  validateUtil(process.env, AppEnvironmentVariables);

  const result: AppEnvironmentVariables = {
    CLIENT_URL: process.env.URL,
    PORT: Number(process.env.PORT),
    IMAGE_HEIGHT: Number(process.env.IMAGE_HEIGHT),
    IMAGE_WIDTH: Number(process.env.IMAGE_WIDTH),
    CACHE_SECONDS: Number(process.env.CACHE_SECONDS),
    GOOGLE_SEARCH_ID: process.env.GOOGLE_SEARCH_ID,
    GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
    OPEN_AI_KEY: process.env.OPEN_AI_KEY,
    DB_URL: process.env.DB_URL,
  };
  return result;
};
