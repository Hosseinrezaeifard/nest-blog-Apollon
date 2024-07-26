import { IsString } from 'class-validator';

export class WriteCommentDto {
  @IsString()
  content: string;
}
