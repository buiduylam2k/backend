import { NullableType } from 'src/utils/types/nullable.type';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { DeepPartial } from 'src/utils/types/deep-partial.type';
import { FilterQuery, ProjectionType, QueryOptions } from 'mongoose';
import { GlobalSearch } from 'src/global-search/domain/global-search';
import {
  FilterGlobalSearchDto,
  SortGlobalSearchDto,
} from 'src/global-search/dto/query-global-search.dto';

export abstract class GlobalSearchRepository {
  abstract create(
    data: Omit<GlobalSearch, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<GlobalSearch>;

  abstract find(
    fields: FilterQuery<GlobalSearch>,
    projection?: ProjectionType<GlobalSearch> | null | undefined,
    options?: QueryOptions<GlobalSearch> | null | undefined,
  ): Promise<NullableType<GlobalSearch[]>>;

  abstract findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterGlobalSearchDto | null;
    sortOptions?: SortGlobalSearchDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<GlobalSearch[]>;

  abstract findOne(
    fields: EntityCondition<GlobalSearch>,
  ): Promise<NullableType<GlobalSearch>>;

  abstract update(
    id: GlobalSearch['id'],
    payload: DeepPartial<GlobalSearch>,
  ): Promise<GlobalSearch | null>;

  abstract softDelete(id: GlobalSearch['id']): Promise<void>;
  abstract deleteByOriginId(originId: GlobalSearch['originId']): Promise<void>;

  abstract updateByOriginId(
    originId: GlobalSearch['originId'],
    payload: DeepPartial<GlobalSearch>,
  ): Promise<GlobalSearch | null>;
}
