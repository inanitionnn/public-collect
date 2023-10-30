import {
  IsNumber,
  IsPositive,
  IsString,
  IsUrl,
  Min,
  MinLength,
} from 'class-validator';
export class AppEnvironmentVariables {
  @IsString()
  @IsUrl({ require_tld: false })
  CLIENT_URL: string;

  @IsNumber()
  @Min(0)
  PORT: number;

  @IsNumber()
  @Min(0)
  IMAGE_HEIGHT: number;

  @IsNumber()
  @Min(0)
  IMAGE_WIDTH: number;

  @IsNumber()
  @Min(0)
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
