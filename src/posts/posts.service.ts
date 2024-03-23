import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import { NullableType } from '../utils/types/nullable.type';
import { PostRepository } from './infrastructure/persistence/post.repository';
import { CreatePostDto } from './dto/create-post.dto';
import { Post } from './domain/post';
import { FilterPostDto, SortPostDto } from './dto/query-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(private readonly postsRepository: PostRepository) {}

  async create(createPostDto: CreatePostDto, authorId: string): Promise<Post> {
    const { content, tags, banner } = createPostDto;

    const clonedPayload = {
      banner,
      content,
      tags,
      views: 0,
      isDeleted: false,
      author: authorId,
      comments: [],
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
    const blog = await this.postsRepository.findOne({ id });

    if (!blog) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            id: 'postNotExists',
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const payload = {
      views: blog.views + 1,
    };

    return this.postsRepository.update(id, payload);
  }

  async update(id: Post['id'], payload: UpdatePostDto): Promise<Post | null> {
    const clonedPayload = { ...payload } as unknown as Post;

    const post = await this.postsRepository.findOne({ id });

    if (post) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            id: 'postAlreadyExists',
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    return this.postsRepository.update(id, clonedPayload);
  }

  async softDelete(id: Post['id']): Promise<void> {
    await this.postsRepository.softDelete(id);
  }
}
