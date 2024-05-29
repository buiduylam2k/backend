import { Injectable } from '@nestjs/common';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import { MetricsRepository } from './infrastructure/persistence/metrics.repository';
import { Metrics } from './domain/metrics';
import { CreateMetricsDto } from './dto/create-metrics.dto';
import { FilterMetricsDto, SortMetricsDto } from './dto/query-metrics.dto';

@Injectable()
export class MetricsService {
  constructor(private readonly metricsRepository: MetricsRepository) {}

  async create(createMetricsDto: CreateMetricsDto): Promise<void> {
    await this.metricsRepository.create({
      type: createMetricsDto.type,
    });
  }

  findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterMetricsDto | null;
    sortOptions?: SortMetricsDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<Metrics[]> {
    return this.metricsRepository.findManyWithPagination({
      filterOptions,
      sortOptions,
      paginationOptions,
    });
  }
}
