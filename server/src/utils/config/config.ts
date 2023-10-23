import { z } from 'zod';
import ZodValidation from './validation';

export default () => {
  const configs = {
    url: {
      value: process.env.URL,
      zod: z.string().min(1),
    },
    port: {
      value: +process.env.PORT,
      zod: z.number().positive(),
    },
    imageHeight: {
      value: +process.env.IMAGE_HEIGHT,
      zod: z.number().positive(),
    },
    imageWigth: {
      value: +process.env.IMAGE_WIDTH,
      zod: z.number().positive(),
    },
    cacheSeconds: {
      value: +process.env.CACHE_SECONDS,
      zod: z.number().positive(),
    },
    googleSeachId: {
      value: process.env.GOOGLE_SEARCH_ID,
      zod: z.string().min(1),
    },
    googleApiKey: {
      value: process.env.GOOGLE_API_KEY,
      zod: z.string().min(1),
    },
    openAiKey: {
      value: process.env.OPEN_AI_KEY,
      zod: z.string().min(1),
    },
  };

  return ZodValidation.validate(configs);
};
