import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import { NullableType } from '../utils/types/nullable.type';
import { BlogRepository } from './infrastructure/persistence/blog.repository';
import { CreateBlogDto } from './dto/create-blog.dto';
import { Blog } from './domain/blog';
import { FilterBlogDto, SortBlogDto } from './dto/query-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';

@Injectable()
export class BlogsService {
  constructor(private readonly blogsRepository: BlogRepository) {}

  async create(createBlogDto: CreateBlogDto, authorId: string): Promise<Blog> {
    const { title, content, tags } = createBlogDto;

    const clonedPayload = {
      title,
      content,
      tags,
      views: 0,
      isDeleted: false,
      author: authorId,
    };

    const blogObject = await this.blogsRepository.findOne({
      title: createBlogDto.title,
    });

    if (blogObject) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            title: 'blogAlreadyExists',
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    return this.blogsRepository.create(clonedPayload);
  }

  findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterBlogDto | null;
    sortOptions?: SortBlogDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<Blog[]> {
    return this.blogsRepository.findManyWithPagination({
      filterOptions,
      sortOptions,
      paginationOptions,
    });
  }

  findOne(fields: EntityCondition<Blog>): Promise<NullableType<Blog>> {
    return this.blogsRepository.findOne(fields);
  }

  async addView(id: Blog['id']): Promise<Blog | null> {
    const blog = await this.blogsRepository.findOne({ id });

    if (!blog) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            id: 'blogNotExists',
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const payload = {
      views: blog.views + 1,
    };

    return this.blogsRepository.update(id, payload);
  }

  async update(id: Blog['id'], payload: UpdateBlogDto): Promise<Blog | null> {
    const clonedPayload = { ...payload } as Blog;

    const blog = await this.blogsRepository.findOne({ title: payload.title });

    if (blog) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            title: 'blogAlreadyExists',
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    return this.blogsRepository.update(id, clonedPayload);
  }

  async softDelete(id: Blog['id']): Promise<void> {
    await this.blogsRepository.softDelete(id);
  }
}
