import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post as PostEntity } from '..//posts/post.entity';
import { Comment as CommentEntity } from '..//comments/comment.entity';
import { User as UserEntity } from '..//users/user.entity';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(CommentEntity)
    private commentRepo: Repository<CommentEntity>,
    @InjectRepository(PostEntity) private postRepo: Repository<PostEntity>,
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
    @InjectQueue('send-email-queue') private emailQueue: Queue,
  ) {}

  async findCommentsByPostId(postId: number) {
    const post = await this.postRepo.findOne({
      where: { id: postId },
    });
    if (!post) {
      throw new NotFoundException('Post not found!');
    }
    return this.commentRepo
      .createQueryBuilder('comments')
      .leftJoinAndSelect('comments.post', 'post')
      .where('post.id = :postId', { postId })
      .select(['comments.id', 'comments.content'])
      .getMany();
  }

  async create(content: string, postId: number, authorId: number) {
    const author = await this.userRepo.findOne({ where: { id: authorId } });
    const post = await this.postRepo.findOne({
      where: { id: postId },
      relations: ['author'],
    });
    if (!post) {
      throw new NotFoundException('Post not found!');
    }
    if (post.author.id === authorId) {
      throw new BadRequestException("You can't comment on your own post!");
    }
    const newComment = new CommentEntity();
    newComment.content = content;
    newComment.post = post;
    newComment.user = author;
    const comment = this.commentRepo.create(newComment);
    const savedComment = await this.commentRepo.save(comment);
    await this.emailQueue.add('send-email', {
      to: savedComment.user.email,
      comment: savedComment.content,
      author: savedComment.post.author.email,
    });
    return savedComment;
  }
}
