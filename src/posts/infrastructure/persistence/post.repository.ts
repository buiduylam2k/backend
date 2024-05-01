import { NullableType } from 'src/utils/types/nullable.type';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { DeepPartial } from 'src/utils/types/deep-partial.type';
import { Post, PostPopulate } from 'src/posts/domain/post';
import { FilterPostDto, SortPostDto } from 'src/posts/dto/query-post.dto';

export abstract class PostRepository {
  abstract create(
    data: Omit<Post, 'id' | 'createdAt' | 'isDeleted' | 'updatedAt'>,
  ): Promise<Post>;

  abstract findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterPostDto | null;
    sortOptions?: SortPostDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<Post[]>;

  abstract findOne(fields: EntityCondition<Post>): Promise<NullableType<Post>>;

  abstract findOnePopulate(
    fields: EntityCondition<Post>,
  ): Promise<NullableType<Post>>;

  abstract update(
    id: Post['id'],
    payload: DeepPartial<Post>,
  ): Promise<Post | null>;

  abstract softDelete(id: Post['id']): Promise<void>;

  abstract deleteAll(): Promise<void>;

  abstract getSlug(slug: string): Promise<string>;
}
