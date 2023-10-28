import { plainToInstance, ClassConstructor } from 'class-transformer';
import { validate } from 'class-validator';
import MyError from '../errors';

export const validation = async (
  validateClass: ClassConstructor<object>,
  jsonDto: any,
): Promise<void> => {
  const errors = await validate(plainToInstance(validateClass, jsonDto));
  if (errors.length > 0) {
    const error = new MyError();
    error.badRequest(Object.values(errors[0].constraints).join(', '));
  }
};
