import { plainToInstance, ClassConstructor } from 'class-transformer';
import { validate } from 'class-validator';

export const validation = async (
  validateClass: ClassConstructor<object>,
  jsonDto: any,
): Promise<string> => {
  const errors = await validate(plainToInstance(validateClass, jsonDto));
  if (errors.length > 0) {
    return Object.values(errors[0].constraints).join(', ');
  }
};
