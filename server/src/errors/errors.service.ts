import { Injectable } from '@nestjs/common';
import * as createError from 'http-errors';

@Injectable()
export class ErrorsService {
  private create(code: number, error?: any) {
    let errorText = '';

    if (error?.errors) {
      errorText = `${error.errors[0].path[0]}: ${error.errors[0].message}`;
    } else if (error.errors) {
      errorText = `${error.errors[0].path[0]}: ${error.errors[0].message}`;
    } else if (typeof error === 'string') {
      errorText = error;
    } else if (error.message && typeof error.message === 'string') {
      errorText = error.message;
    } else if (error.message && error.message.length) {
      errorText = error.message[0];
    } else if (error.messages && error.messages.length) {
      errorText = error.messages[0];
    }

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
