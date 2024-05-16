import { NullableType } from 'src/utils/types/nullable.type';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { DeepPartial } from 'src/utils/types/deep-partial.type';
import { FilterQuery, ProjectionType, QueryOptions } from 'mongoose';
import { AffLink } from 'src/aff-link/domain/aff-link';
import {
  FilterAffLinkDto,
  SortAffLinkDto,
} from 'src/aff-link/dto/query-aff-link.dto';

export abstract class AffLinkRepository {
  abstract create(
    data: Omit<AffLink, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<AffLink>;

  abstract find(
    fields: FilterQuery<AffLink>,
    projection?: ProjectionType<AffLink> | null | undefined,
    options?: QueryOptions<AffLink> | null | undefined,
  ): Promise<NullableType<AffLink[]>>;

  abstract findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterAffLinkDto | null;
    sortOptions?: SortAffLinkDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<AffLink[]>;

  abstract findOne(
    fields: EntityCondition<AffLink>,
  ): Promise<NullableType<AffLink>>;

  abstract update(
    id: AffLink['id'],
    payload: DeepPartial<AffLink>,
  ): Promise<AffLink | null>;

  abstract getActive(): Promise<AffLink | null>;

  abstract softDelete(id: AffLink['id']): Promise<void>;
}
