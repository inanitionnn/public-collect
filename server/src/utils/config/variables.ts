import {
  IsNumber,
  IsPositive,
  IsString,
  IsUrl,
  MinLength,
} from 'class-validator';
export class AppEnvironmentVariables {
  @IsString()
  @IsUrl({ require_tld: false })
  CLIENT_URL: string;

  @IsNumber()
  @IsPositive()
  PORT: number;

  @IsNumber()
  @IsPositive()
  IMAGE_HEIGHT: number;

  @IsNumber()
  @IsPositive()
  IMAGE_WIDTH: number;

  @IsNumber()
  @IsPositive()
  CACHE_SECONDS: number;

  @IsString()
  @MinLength(1)
  GOOGLE_SEARCH_ID: string;

  @IsString()
  @MinLength(1)
  GOOGLE_API_KEY: string;

  @IsString()
  @MinLength(1)
  OPEN_AI_KEY: string;

  @IsString()
  @MinLength(1)
  DB_URL: string;
}
