import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import { NullableType } from '../utils/types/nullable.type';
import { PostRepository } from './infrastructure/persistence/post.repository';
import { CreatePostDto } from './dto/create-post.dto';
import { Post } from './domain/post';
import { FilterPostDto, SortPostDto } from './dto/query-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { CommentRepository } from './infrastructure/persistence/comment.repository';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class PostsService {
  constructor(
    private readonly postsRepository: PostRepository,
    private readonly commentsRepository: CommentRepository,
  ) {}

  async create(createPostDto: CreatePostDto, authorId: string): Promise<Post> {
    const { content, tags, banner, title } = createPostDto;

    const clonedPayload = {
      banner,
      content,
      tags,
      views: 0,
      isDeleted: false,
      author: authorId,
      comments: [],
      title,
    };

    return this.postsRepository.create(clonedPayload);
  }

  findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterPostDto | null;
    sortOptions?: SortPostDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<Post[]> {
    return this.postsRepository.findManyWithPagination({
      filterOptions,
      sortOptions,
      paginationOptions,
    });
  }

  findOne(fields: EntityCondition<Post>): Promise<NullableType<Post>> {
    return this.postsRepository.findOne(fields);
  }

  async addView(id: Post['id']): Promise<Post | null> {
    const post = await this.postsRepository.findOne({ id });

    if (!post) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          errors: {
            id: 'postNotFound',
          },
        },
        HttpStatus.NOT_FOUND,
      );
    }

    const payload = {
      views: post.views + 1,
    };

    return this.postsRepository.update(id, payload);
  }

  async update(id: Post['id'], payload: UpdatePostDto): Promise<Post | null> {
    const clonedPayload = { ...payload } as unknown as Post;

    const post = await this.postsRepository.findOne({ id });

    if (!post) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          errors: {
            id: 'postNotFound',
          },
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return this.postsRepository.update(id, clonedPayload);
  }

  async softDelete(id: Post['id']): Promise<void> {
    await this.postsRepository.softDelete(id);
  }

  async addComment(
    id: Post['id'],
    author: string,
    createCommentDto: CreateCommentDto,
  ): Promise<Post['id']> {
    const post = await this.findOne({ id });

    if (!post) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          errors: {
            id: 'postNotFound',
          },
        },
        HttpStatus.NOT_FOUND,
      );
    }

    const { content } = createCommentDto;

    const newComment = await this.commentsRepository.create({
      content,
      author,
      post: id.toString(),
    });

    await this.update(id, {
      comments: [...post.comments, newComment.id.toString()],
    });

    return id;
  }
}
