import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import { NullableType } from '../utils/types/nullable.type';
import { BlogRepository } from './infrastructure/persistence/blog.repository';
import { CreateBlogDto } from './dto/create-blog.dto';
import { Blog } from './domain/blog';
import { FilterBlogDto, SortBlogDto } from './dto/query-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { SlugGeneratorService } from 'src/slug-generator/slug-generator.service';

@Injectable()
export class BlogsService {
  constructor(
    private readonly blogsRepository: BlogRepository,
    private readonly slugGenerator: SlugGeneratorService,
  ) {}

  async create(createBlogDto: CreateBlogDto, authorId: string): Promise<Blog> {
    const { title, content, tags, banner } = createBlogDto;
    const slug = this.slugGenerator.generateUniqueSlug(title);

    const clonedPayload = {
      title,
      content,
      tags,
      views: 0,
      isDeleted: false,
      author: authorId,
      slug,
      banner,
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

  getSeo(fields: EntityCondition<Blog>): Promise<NullableType<Blog>> {
    return this.blogsRepository.findOne(fields);
  }

  async addView(slug: Blog['slug']): Promise<void> {
    const blog = await this.blogsRepository.findOne({ slug });

    if (!blog) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            slug: 'blogNotExists',
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const payload = {
      views: blog.views + 1,
    };

    await this.blogsRepository.update(blog.id, payload);
  }

  async update(
    slug: Blog['slug'],
    payload: UpdateBlogDto,
  ): Promise<Blog | null> {
    const blog = await this.blogsRepository.findOne({ slug });

    if (!blog) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            slug: 'blogNotFound',
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    let updateSlug;

    if (payload.title) {
      updateSlug = this.slugGenerator.generateUniqueSlug(payload.title);
    }

    const clonedPayload = { ...payload, slug: updateSlug } as Blog;

    return this.blogsRepository.update(blog.id, clonedPayload);
  }

  async softDelete(slug: Blog['slug']): Promise<void> {
    await this.blogsRepository.softDelete(slug);
  }

  async deleteAll() {
    await this.blogsRepository.deleteAll();
  }
}
