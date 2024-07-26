import {
  IsString,
  IsOptional,
  IsArray,
  ArrayNotEmpty,
  ArrayMaxSize,
} from 'class-validator';

export class UpdatePostDto {
  @IsString()
  @IsOptional()
  title: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsOptional()
  article: string;

  @IsArray()
  @ArrayNotEmpty()
  @ArrayMaxSize(10)
  @IsString({ each: true })
  @IsOptional()
  tags: string[];
}
