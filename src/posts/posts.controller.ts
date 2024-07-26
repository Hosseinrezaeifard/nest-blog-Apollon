import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Session,
  UseGuards,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { AuthGuard } from '..//guards/auth.guard';
import { UpdatePostDto } from './dtos/update-post.dto';
import { CreatePostDto } from './dtos/create-post.dto';

@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @UseGuards(AuthGuard)
  @Post()
  async createPost(@Body() body: CreatePostDto, @Session() session: any) {
    const post = await this.postsService.create(
      body.title,
      body.description,
      body.article,
      body.tags,
      session.userId,
    );
    return post;
  }

  @UseGuards(AuthGuard)
  @Patch('/:id')
  updatePost(
    @Param('id') id: string,
    @Session() session: any,
    @Body() body: UpdatePostDto,
  ) {
    return this.postsService.update(parseInt(id), session.userId, body);
  }

  @UseGuards(AuthGuard)
  @Delete('/:id')
  removePost(@Param('id') id: string, @Session() session: any) {
    return this.postsService.remove(parseInt(id), session.userId);
  }

  @UseGuards(AuthGuard)
  @Get()
  findUserPosts(@Session() session: any) {
    return this.postsService.findPostsByUserId(session.userId);
  }

  @Get('/feed')
  findAllPosts() {
    return this.postsService.findAll();
  }

  @Get(':id')
  findPost(@Param('id') id: string) {
    return this.postsService.findOne(parseInt(id));
  }
}
