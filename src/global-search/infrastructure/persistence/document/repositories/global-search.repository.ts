import { Injectable } from '@nestjs/common';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, ProjectionType, QueryOptions } from 'mongoose';
import { GlobalSearchRepository } from '../../global-search.repository';
import { GlobalSearchSchemaClass } from '../entities/global-search.schema';
import { GlobalSearchMapper } from '../mappers/global-search.mapper';
import { GlobalSearch } from 'src/global-search/domain/global-search';
import {
  FilterGlobalSearchDto,
  SortGlobalSearchDto,
} from 'src/global-search/dto/query-global-search.dto';
import { NullableType } from 'src/utils/types/nullable.type';

@Injectable()
export class GlobalSearchDocumentRepository implements GlobalSearchRepository {
  constructor(
    @InjectModel(GlobalSearchSchemaClass.name)
    private readonly globalSearchModel: Model<GlobalSearchSchemaClass>,
  ) {}

  async deleteByOriginId(originId: string): Promise<void> {
    await this.globalSearchModel.deleteOne({
      originId,
    });
  }

  async find(
    filter: FilterQuery<GlobalSearch>,
    projection?: ProjectionType<GlobalSearch> | null | undefined,
    options?: QueryOptions<GlobalSearch> | null | undefined,
  ): Promise<NullableType<GlobalSearch[]>> {
    const globalSearchsObjects = await this.globalSearchModel.find(
      filter,
      projection,
      options,
    );
    return globalSearchsObjects.map((tagObject) =>
      GlobalSearchMapper.toDomain(tagObject),
    );
  }

  async create(data: GlobalSearch): Promise<GlobalSearch> {
    const persistenceModel = GlobalSearchMapper.toPersistence(data);
    const createdTopic = new this.globalSearchModel(persistenceModel);
    const globalSearchObject = await createdTopic.save();
    return GlobalSearchMapper.toDomain(globalSearchObject);
  }

  async findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterGlobalSearchDto | null;
    sortOptions?: SortGlobalSearchDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<GlobalSearch[]> {
    const globalSearchsObjects = await this.globalSearchModel
      .find({
        ...filterOptions,
        name: {
          $regex: new RegExp(filterOptions?.name!, 'i'),
        },
      })
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
    return globalSearchsObjects.map((globalSearchObject) =>
      GlobalSearchMapper.toDomain(globalSearchObject),
    );
  }

  async findOne(
    fields: EntityCondition<GlobalSearch>,
  ): Promise<NullableType<GlobalSearch>> {
    if (fields.id) {
      const globalSearchObject = await this.globalSearchModel.findById(
        fields.id,
      );
      return globalSearchObject
        ? GlobalSearchMapper.toDomain(globalSearchObject)
        : null;
    }

    const globalSearchObject = await this.globalSearchModel.findOne(fields);
    return globalSearchObject
      ? GlobalSearchMapper.toDomain(globalSearchObject)
      : null;
  }

  async update(
    id: GlobalSearch['id'],
    payload: Partial<GlobalSearch>,
  ): Promise<GlobalSearch | null> {
    const clonedPayload = { ...payload };
    delete clonedPayload.id;

    const filter = { _id: id };
    const globalSearchObject = await this.globalSearchModel.findOneAndUpdate(
      filter,
      clonedPayload,
    );

    return globalSearchObject
      ? GlobalSearchMapper.toDomain(globalSearchObject)
      : null;
  }

  async updateByOriginId(
    originId: GlobalSearch['originId'],
    payload: Partial<GlobalSearch>,
  ): Promise<GlobalSearch | null> {
    const clonedPayload = { ...payload };
    delete clonedPayload.id;

    const filter = { originId };
    const globalSearchObject = await this.globalSearchModel.findOneAndUpdate(
      filter,
      clonedPayload,
    );

    return globalSearchObject
      ? GlobalSearchMapper.toDomain(globalSearchObject)
      : null;
  }

  async softDelete(id: GlobalSearch['id']): Promise<void> {
    await this.globalSearchModel.deleteOne({
      _id: id,
    });
  }
}
