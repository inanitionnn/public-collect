import { Logger } from '@nestjs/common';
import { Schema, z } from 'zod';

interface ConfigProps {
  value: unknown;
  zod: Schema;
}

export type ZodConfig<T> = Record<keyof T, ConfigProps>;

export default class ZodValidation {
  static validate<T>(config: ZodConfig<T>): T {
    const schemaObj = ZodValidation.extractByPropName(config, 'zod');
    const schema = z.object(schemaObj);
    const values = ZodValidation.extractByPropName(config, 'value');
    try {
      schema.parse(values);
    } catch (errors) {
      const logger = new Logger('Config');
      logger.error(
        `${errors.errors[0].path[0].toUpperCase()}: ${
          errors.errors[0].message
        }`,
      );
      throw new Error(`Config validation failed`);
    }
    return values;
  }

  static extractByPropName<T>(
    config: ZodConfig<T>,
    propName: keyof ConfigProps,
  ) {
    const arr: any[] = Object.keys(config).map((key) => {
      return {
        [key]: config[key][propName],
      };
    });
    return Object.assign({}, ...arr);
  }
}
