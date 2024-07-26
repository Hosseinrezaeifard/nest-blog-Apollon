import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post as PostEntity } from '..//posts/post.entity';
import { User as UserEntity } from '..//users/user.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostEntity) private postRepo: Repository<PostEntity>,
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
  ) {}

  async create(
    title: string,
    description: string,
    article: string,
    tags: string[],
    authorId: number,
  ) {
    const author = await this.userRepo.findOne({
      where: { id: authorId },
    });
    const newPost = new PostEntity();
    newPost.title = title;
    newPost.description = description;
    newPost.article = article;
    newPost.tags = tags;
    newPost.author = author;
    newPost.comments = [];
    const post = this.postRepo.create(newPost);
    return this.postRepo.save(post);
  }

  async update(id: number, userId: number, attrs: Partial<PostEntity>) {
    const post = await this.postRepo.findOne({
      where: { id },
      relations: ['author', 'comments'],
    });
    if (!post) {
      throw new NotFoundException('Post not found!');
    }
    if (post.author.id !== userId) {
      throw new ForbiddenException(
        'You are not authorized to perform this action',
      );
    }
    Object.assign(post, attrs);
    return this.postRepo.save(post);
  }

  async remove(id: number, userId: number) {
    const post = await this.postRepo.findOne({
      where: { id },
      relations: ['author', 'comments'],
    });
    if (!post) {
      throw new NotFoundException('Post not found!');
    }
    if (post.author.id !== userId) {
      throw new ForbiddenException(
        'You are not authorized to perform this action',
      );
    }
    return this.postRepo.remove(post);
  }

  async findPostsByUserId(userId: number) {
    return this.postRepo
      .createQueryBuilder('posts')
      .leftJoinAndSelect('posts.author', 'author')
      .where('author.id = :userId', { userId })
      .getMany();
  }

  async findAll() {
    return this.postRepo.find();
  }

  async findOne(id: number) {
    const post = await this.postRepo.findOne({
      where: { id },
      relations: ['author', 'comments'],
    });
    if (!post) {
      throw new NotFoundException('Post not found!');
    }
    await this.postRepo.increment({ id }, 'viewCount', 1);
    return post;
  }
}
