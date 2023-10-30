import {
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Length,
  Max,
  Min,
} from 'class-validator';

export class SeasonCreateDto {
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

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(10)
  rate?: number;
}
