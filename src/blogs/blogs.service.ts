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
import { GlobalSearchService } from 'src/global-search/global-search.service';

@Injectable()
export class BlogsService {
  constructor(
    private readonly blogsRepository: BlogRepository,
    private readonly slugGenerator: SlugGeneratorService,
    private readonly globalSearchService: GlobalSearchService,
  ) {}

  async create(createBlogDto: CreateBlogDto, authorId: string): Promise<Blog> {
    const { title, content, tag, banner } = createBlogDto;
    const slug = this.slugGenerator.generateUniqueSlug(title);

    const clonedPayload = {
      title,
      content,
      tag,
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
    const bloged = await this.blogsRepository.create(clonedPayload);

    await this.globalSearchService.create({
      name: bloged.title,
      originId: bloged.id.toString(),
      type: 'blog',
      slug: bloged.slug,
    });
    return bloged;
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

    let updateSlug = blog.slug;

    if (payload.title) {
      updateSlug = this.slugGenerator.generateUniqueSlug(payload.title);
      await this.globalSearchService.updateByOriginId(blog.id.toString(), {
        name: payload.title,
        slug: updateSlug,
      });
    }

    const clonedPayload = { ...payload, slug: updateSlug } as Blog;

    return this.blogsRepository.update(blog.id, clonedPayload);
  }

  async softDelete(slug: Blog['slug']): Promise<void> {
    const blog = await this.findOne({ slug });
    if (blog) {
      await this.blogsRepository.softDelete(slug);
      await this.globalSearchService.deleteByOriginId(blog.id.toString());
    }
  }

  async deleteAll() {
    await this.blogsRepository.deleteAll();
  }
}
