import { NullableType } from 'src/utils/types/nullable.type';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { DeepPartial } from 'src/utils/types/deep-partial.type';
import { Tag } from 'src/tags/domain/tag';
import { FilterTagDto, SortTagDto } from 'src/tags/dto/query-tag.dto';
import { FilterQuery, ProjectionType, QueryOptions } from 'mongoose';

export abstract class TagRepository {
  abstract create(
    data: Omit<Tag, 'id' | 'createdAt' | 'isDeleted' | 'updatedAt'>,
  ): Promise<Tag>;

  abstract find(
    fields: FilterQuery<Tag>,
    projection?: ProjectionType<Tag> | null | undefined,
    options?: QueryOptions<Tag> | null | undefined,
  ): Promise<NullableType<Tag[]>>;

  abstract findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterTagDto | null;
    sortOptions?: SortTagDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<Tag[]>;

  abstract findOne(fields: EntityCondition<Tag>): Promise<NullableType<Tag>>;

  abstract update(
    id: Tag['id'],
    payload: DeepPartial<Tag>,
  ): Promise<Tag | null>;

  abstract softDelete(id: Tag['id']): Promise<void>;
}
