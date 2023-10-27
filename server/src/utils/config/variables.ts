import { IsNumber, IsPositive, IsString, IsUrl, Min } from 'class-validator';
export class AppEnvironmentVariables {
  @IsUrl()
  URL: string;

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
  @Min(1)
  GOOGLE_SEARCH_ID: string;

  @IsString()
  @Min(1)
  GOOGLE_API_KEY: string;

  @IsString()
  @Min(1)
  OPEN_AI_KEY: string;

  @IsUrl()
  DB_URL: string;
}
