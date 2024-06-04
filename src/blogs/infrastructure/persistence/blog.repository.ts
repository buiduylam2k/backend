import { NullableType } from 'src/utils/types/nullable.type';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { DeepPartial } from 'src/utils/types/deep-partial.type';
import { Blog } from 'src/blogs/domain/blog';
import { FilterBlogDto, SortBlogDto } from 'src/blogs/dto/query-blog.dto';

export abstract class BlogRepository {
  abstract create(
    data: Omit<Blog, 'id' | 'createdAt' | 'isDeleted' | 'updatedAt'>,
  ): Promise<Blog>;

  abstract findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterBlogDto | null;
    sortOptions?: SortBlogDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<Blog[]>;

  abstract findOne(fields: EntityCondition<Blog>): Promise<NullableType<Blog>>;

  abstract getSeo(
    slug: string,
  ): Promise<NullableType<Pick<Blog, 'title' | 'content' | 'slug' | 'banner'>>>;

  abstract update(
    id: Blog['id'],
    payload: DeepPartial<Blog>,
  ): Promise<Blog | null>;

  abstract softDelete(slug: Blog['slug']): Promise<void>;
  abstract deleteAll(): Promise<void>;
  abstract total(): Promise<number>;
}
