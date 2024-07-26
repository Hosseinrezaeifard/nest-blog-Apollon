import {
  IsString,
  IsOptional,
  IsArray,
  ArrayNotEmpty,
  ArrayMaxSize,
} from 'class-validator';

export class CreatePostDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  article: string;

  @IsArray()
  @ArrayNotEmpty()
  @ArrayMaxSize(10)
  @IsString({ each: true })
  tags: string[];
}
