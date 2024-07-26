import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Session,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '..//guards/auth.guard';
import { CommentsService } from './comments.service';
import { WriteCommentDto } from './dtos/write-comment.dto';

@Controller('comments')
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  @UseGuards(AuthGuard)
  @Post('/:id')
  async createPost(
    @Param('id') id: string,
    @Body() body: WriteCommentDto,
    @Session() session: any,
  ) {
    const comment = await this.commentsService.create(
      body.content,
      parseInt(id),
      session.userId,
    );
    return comment;
  }

  @Get('/:id')
  findPostComments(@Param('id') id: string) {
    return this.commentsService.findCommentsByPostId(parseInt(id));
  }
}
