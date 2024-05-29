import { NullableType } from 'src/utils/types/nullable.type';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import { FilterQuery, ProjectionType, QueryOptions } from 'mongoose';
import { Metrics } from 'src/metrics/domain/metrics';
import {
  FilterMetricsDto,
  SortMetricsDto,
} from 'src/metrics/dto/query-metrics.dto';

export abstract class MetricsRepository {
  abstract create(data: Pick<Metrics, 'type'>): Promise<Metrics>;

  abstract find(
    fields: FilterQuery<Metrics>,
    projection?: ProjectionType<Metrics> | null | undefined,
    options?: QueryOptions<Metrics> | null | undefined,
  ): Promise<NullableType<Metrics[]>>;

  abstract findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterMetricsDto | null;
    sortOptions?: SortMetricsDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<Metrics[]>;
}
