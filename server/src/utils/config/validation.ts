import { plainToClass } from 'class-transformer';
import { validateSync } from 'class-validator';
import { ClassConstructor } from 'class-transformer/types/interfaces';
import { Logger } from '@nestjs/common';

export function validateUtil(
  config: Record<string, unknown>,
  envVariablesClass: ClassConstructor<any>,
) {
  const validatedConfig = plainToClass(envVariablesClass, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });
  const logger = new Logger('Config');
  if (errors.length > 0) {
    logger.error(
      `\n     ENV: (${errors[0].property})\n     Value: (${
        errors[0].value
      })\n     ERROR: (${Object.values(errors[0].constraints).join(', ')})`,
    );
    throw new Error(Object.values(errors[0].constraints).join(', '));
  }
  return validatedConfig;
}
