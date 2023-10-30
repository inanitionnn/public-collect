import { IsInt, IsString, Max, Min } from 'class-validator';

export class TitleResponseDto {
  @IsString()
  title: string;

  @IsInt()
  @Min(0)
  @Max(new Date().getFullYear() + 20)
  year: number;
}
