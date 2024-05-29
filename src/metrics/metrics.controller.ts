import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Query,
  HttpStatus,
  HttpCode,
  SerializeOptions,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/roles/roles.guard';
import { infinityPagination } from 'src/utils/infinity-pagination';
import { InfinityPaginationResultType } from '../utils/types/infinity-pagination-result.type';
import { Roles } from 'src/roles/roles.decorator';
import { RoleEnum } from 'src/roles/roles.enum';
import { MetricsService } from './metrics.service';
import { CreateMetricsDto } from './dto/create-metrics.dto';
import { Metrics } from './domain/metrics';
import { QueryMetricsDto } from './dto/query-metrics.dto';
import { MetricsDomainUtils } from './domain/utils';

@ApiBearerAuth()
@Roles(RoleEnum.admin, RoleEnum.user)
@SerializeOptions({
  groups: ['admin'],
})
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiTags('Metrics')
@Controller({
  path: 'metrics',
  version: '1',
})
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}

  @Post()
  @HttpCode(HttpStatus.NO_CONTENT)
  create(@Body() createMetricsDto: CreateMetricsDto): Promise<void> {
    return this.metricsService.create(createMetricsDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query() query: QueryMetricsDto,
  ): Promise<InfinityPaginationResultType<Metrics>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > MetricsDomainUtils.QUERY_LIMIT) {
      limit = MetricsDomainUtils.QUERY_LIMIT;
    }

    return infinityPagination(
      await this.metricsService.findManyWithPagination({
        filterOptions: query?.filters,
        sortOptions: query?.sort,
        paginationOptions: {
          page,
          limit,
        },
      }),
      { page, limit },
    );
  }
}
