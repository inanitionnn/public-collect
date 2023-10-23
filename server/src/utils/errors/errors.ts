import { Logger } from '@nestjs/common';
import * as createError from 'http-errors';

export default class myError {
  constructor(private logger: Logger) {}
  private create(code: number, error?: any) {
    let errorText = '';
    if (error.errors) {
      errorText = `${error.errors[0].path[0]}: ${error.errors[0].message}`;
    }
    if (typeof error === 'string') {
      errorText = error;
    }
    if (error.message && typeof error.message === 'string') {
      errorText = error.message;
    }
    if (error.message && error.message.length) {
      errorText = error.message[0];
    }
    if (error.messages && error.messages.length) {
      errorText = error.messages[0];
    }

    this.logger.error(`[${code}] ${errorText}`);
    return createError(code, errorText);
  }

  public badRequest(error: any) {
    throw this.create(400, error);
  }

  public unauthorized(error: any) {
    throw this.create(401, error);
  }

  public forbidden(error: any) {
    throw this.create(403, error);
  }

  public notFound(error: any) {
    throw this.create(404, error);
  }

  public internalServerError(error: any) {
    throw this.create(500, error);
  }

  public notImplemented(error: any) {
    throw this.create(500, error);
  }
}
