import { Injectable } from '@nestjs/common';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, ProjectionType, QueryOptions } from 'mongoose';
import { TagSchemaClass } from '../entities/tag.schema';
import { Tag } from 'src/tags/domain/tag';
import { TagMapper } from '../mappers/tag.mapper';
import { FilterTagDto, SortTagDto } from 'src/tags/dto/query-tag.dto';
import { TagRepository } from '../../tag.repository';
import { UserMapper } from 'src/users/infrastructure/persistence/document/mappers/user.mapper';

@Injectable()
export class TagsDocumentRepository implements TagRepository {
  constructor(
    @InjectModel(TagSchemaClass.name)
    private readonly tagsModel: Model<TagSchemaClass>,
  ) {}

  async find(
    filter: FilterQuery<Tag>,
    projection?: ProjectionType<Tag> | null | undefined,
    options?: QueryOptions<Tag> | null | undefined,
  ): Promise<NullableType<Tag[]>> {
    const tagsObjects = await this.tagsModel.find(filter, projection, options);
    return tagsObjects.map((tagObject) => TagMapper.toDomain(tagObject));
  }

  async create(data: Tag): Promise<Tag> {
    const persistenceModel = TagMapper.toPersistence(data);
    const createdTopic = new this.tagsModel(persistenceModel);
    const topicObject = await createdTopic.save();
    return TagMapper.toDomain(topicObject);
  }

  async findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterTagDto | null;
    sortOptions?: SortTagDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<Tag[]> {
    const where: EntityCondition<Tag> = {
      ...filterOptions,
      isDeleted: false,
    };

    const tagsObjects = await this.tagsModel
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
      .populate({
        path: 'author',
        transform: UserMapper.toDomain,
      })
      .lean();

    // https://stackoverflow.com/questions/77168216/why-mongoose-populate-causes-maximum-call-stack-size-exceeded-error-in-nextjs
    return tagsObjects.map((tagObject) => TagMapper.toDomain(tagObject));
  }

  async findOne(fields: EntityCondition<Tag>): Promise<NullableType<Tag>> {
    if (fields.id) {
      const topicObject = await this.tagsModel.findById(fields.id);
      return topicObject ? TagMapper.toDomain(topicObject) : null;
    }

    const topicObject = await this.tagsModel.findOne(fields);
    return topicObject ? TagMapper.toDomain(topicObject) : null;
  }

  async update(id: Tag['id'], payload: Partial<Tag>): Promise<Tag | null> {
    const clonedPayload = { ...payload };
    delete clonedPayload.id;

    const filter = { _id: id };
    const topicObject = await this.tagsModel.findOneAndUpdate(
      filter,
      clonedPayload,
    );

    return topicObject ? TagMapper.toDomain(topicObject) : null;
  }

  async softDelete(id: Tag['id']): Promise<void> {
    // await this.tagsModel.deleteOne({
    //   _id: id,
    // });

    await this.tagsModel.findOneAndUpdate(
      {
        _id: id,
      },
      {
        isDeleted: true,
      },
    );
  }
}
