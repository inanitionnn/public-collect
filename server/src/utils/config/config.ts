import { z } from 'zod';
import ZodValidation, { ZodConfig } from './validation';

interface IAppConfig {
  databaseUrl: string;
  port: number;
}

export default (): IAppConfig => {
  const configs: ZodConfig<IAppConfig> = {
    databaseUrl: {
      value: process.env.DATABASE_URL,
      zod: z.string(),
    },
    port: {
      value: parseInt(process.env.PORT),
      zod: z.number().positive(),
    },
  };

  return ZodValidation.validate(configs);
};
