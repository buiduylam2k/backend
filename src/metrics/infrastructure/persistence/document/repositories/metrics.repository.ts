import { Injectable } from '@nestjs/common';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, ProjectionType, QueryOptions } from 'mongoose';
import { MetricsRepository } from '../../metrics.repository';
import { MetricsSchemaClass } from '../entities/metrics.schema';
import { Metrics } from 'src/metrics/domain/metrics';
import { MetricsMapper } from '../mappers/metrics.mapper';
import {
  FilterMetricsDto,
  SortMetricsDto,
} from 'src/metrics/dto/query-metrics.dto';

@Injectable()
export class MetricsDocumentRepository implements MetricsRepository {
  constructor(
    @InjectModel(MetricsSchemaClass.name)
    private readonly metricsModel: Model<MetricsSchemaClass>,
  ) {}

  async find(
    filter: FilterQuery<Metrics>,
    projection?: ProjectionType<Metrics> | null | undefined,
    options?: QueryOptions<Metrics> | null | undefined,
  ): Promise<NullableType<Metrics[]>> {
    const metricsObjects = await this.metricsModel.find(
      filter,
      projection,
      options,
    );
    return metricsObjects.map((metricObject) =>
      MetricsMapper.toDomain(metricObject),
    );
  }

  async create(data: Metrics): Promise<Metrics> {
    const persistenceModel = MetricsMapper.toPersistence(data);
    const createdTopic = new this.metricsModel(persistenceModel);
    const topicObject = await createdTopic.save();
    return MetricsMapper.toDomain(topicObject);
  }

  async findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterMetricsDto | null;
    sortOptions?: SortMetricsDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<Metrics[]> {
    const where: EntityCondition<Metrics> = {};

    const metricsObjects = await this.metricsModel
      .find(where)
      .sort(
        sortOptions?.reduce(
          (accumulator, sort) => ({
            ...accumulator,
            [sort.orderBy === 'id' ? '_id' : sort.orderBy]:
              sort.order.toUpperCase() === 'ASC' ? 1 : -1,
          }),
          {},
        ),
      )
      .skip((paginationOptions.page - 1) * paginationOptions.limit)
      .limit(paginationOptions.limit)
      .lean();

    // https://stackoverflow.com/questions/77168216/why-mongoose-populate-causes-maximum-call-stack-size-exceeded-error-in-nextjs
    return metricsObjects.map((mericsObject) =>
      MetricsMapper.toDomain(mericsObject),
    );
  }
}
