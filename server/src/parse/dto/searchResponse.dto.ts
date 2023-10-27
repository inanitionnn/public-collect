import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUrl } from 'class-validator';

export class SearchResponseDto {
  @ApiProperty()
  @IsUrl()
  link: string;

  @ApiProperty()
  @IsOptional()
  image?: string | null;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  description?: string;
}
