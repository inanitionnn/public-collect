import {
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  Length,
  Max,
  Min,
} from 'class-validator';

export class SeasonResponseDto {
  @IsUUID()
  id: string;

  @IsInt()
  @Min(0)
  number: number;

  @IsOptional()
  @IsString()
  @Length(1, 256)
  title?: string;

  @IsInt()
  @Min(0)
  episodes?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(10)
  rate?: number;
}
