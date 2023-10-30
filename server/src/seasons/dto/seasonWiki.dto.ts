import {
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Length,
  Min,
} from 'class-validator';

export class SeasonWikiDto {
  @IsInt()
  @Min(0)
  number: number;

  @IsOptional()
  @IsString()
  @Length(1, 256)
  title?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  episodes?: number;
}
