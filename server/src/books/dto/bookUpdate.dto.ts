import {
  IsArray,
  IsIn,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Length,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { bookEnum, BookType } from '../book.entity';
import { BookDto } from './book.dto';

export class BookUpdateDto implements Omit<BookDto, 'id'> {
  @ApiProperty()
  @IsOptional()
  @IsIn(bookEnum.enumValues)
  type?: BookType;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @Length(1, 256)
  title?: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @IsPositive()
  year?: number;

  @ApiProperty()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Length(1, 256, { each: true })
  country?: string[];

  @ApiProperty()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Length(1, 256, { each: true })
  author?: string[];

  @ApiProperty()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Length(1, 256, { each: true })
  language?: string[];

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @IsPositive()
  pages?: number;

  @ApiProperty()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Length(1, 256, { each: true })
  genres?: string[];

  @ApiProperty()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Length(1, 256, { each: true })
  tags?: string[];

  @ApiProperty()
  @IsOptional()
  @IsString()
  image?: string;

  @ApiProperty()
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  embedding?: number[];
}
