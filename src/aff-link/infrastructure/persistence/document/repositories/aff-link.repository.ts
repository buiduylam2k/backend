import { Injectable } from '@nestjs/common';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, ProjectionType, QueryOptions } from 'mongoose';
import { AffLinkRepository } from '../../aff-link.repository';
import { AffLinkSchemaClass } from '../entities/aff-link.schema';
import { AffLinkMapper } from '../mappers/aff-link.mapper';
import { AffLink } from 'src/aff-link/domain/aff-link';
import {
  FilterAffLinkDto,
  SortAffLinkDto,
} from 'src/aff-link/dto/query-aff-link.dto';

@Injectable()
export class AffLinkDocumentRepository implements AffLinkRepository {
  constructor(
    @InjectModel(AffLinkSchemaClass.name)
    private readonly affLinkModel: Model<AffLinkSchemaClass>,
  ) {}

  async getActive(): Promise<AffLink | null> {
    const affLinkObjectsActived = await this.affLinkModel.find({
      isActive: true,
    });

    if (!affLinkObjectsActived.length) {
      return null;
    }

    return AffLinkMapper.toDomain(affLinkObjectsActived[0]);
  }

  async find(
    filter: FilterQuery<AffLink>,
    projection?: ProjectionType<AffLink> | null | undefined,
    options?: QueryOptions<AffLink> | null | undefined,
  ): Promise<NullableType<AffLink[]>> {
    const affLinkObjects = await this.affLinkModel.find(
      filter,
      projection,
      options,
    );
    return affLinkObjects.map((tagObject) => AffLinkMapper.toDomain(tagObject));
  }

  async create(data: AffLink): Promise<AffLink> {
    const persistenceModel = AffLinkMapper.toPersistence(data);
    const createdTopic = new this.affLinkModel(persistenceModel);
    const topicObject = await createdTopic.save();
    return AffLinkMapper.toDomain(topicObject);
  }

  async findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterAffLinkDto | null;
    sortOptions?: SortAffLinkDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<AffLink[]> {
    const where: EntityCondition<AffLink> = {
      ...filterOptions,
    };

    const affLinkObjects = await this.affLinkModel
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
    return affLinkObjects.map((tagObject) => AffLinkMapper.toDomain(tagObject));
  }

  async findOne(
    fields: EntityCondition<AffLink>,
  ): Promise<NullableType<AffLink>> {
    if (fields.id) {
      const topicObject = await this.affLinkModel.findById(fields.id);
      return topicObject ? AffLinkMapper.toDomain(topicObject) : null;
    }

    const topicObject = await this.affLinkModel.findOne(fields);
    return topicObject ? AffLinkMapper.toDomain(topicObject) : null;
  }

  async update(
    id: AffLink['id'],
    payload: Partial<AffLink>,
  ): Promise<AffLink | null> {
    const clonedPayload = { ...payload };
    delete clonedPayload.id;

    const filter = { _id: id };
    const topicObject = await this.affLinkModel.findOneAndUpdate(
      filter,
      clonedPayload,
    );

    return topicObject ? AffLinkMapper.toDomain(topicObject) : null;
  }

  async softDelete(id: AffLink['id']): Promise<void> {
    await this.affLinkModel.deleteOne({
      _id: id,
    });
  }
}
