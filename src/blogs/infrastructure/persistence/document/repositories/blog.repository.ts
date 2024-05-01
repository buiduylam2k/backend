import { Injectable } from '@nestjs/common';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BlogRepository } from '../../blog.repository';
import { BlogSchemaClass } from '../entities/blog.schema';
import { Blog } from 'src/blogs/domain/blog';
import { BlogMapper } from '../mappers/blog.mapper';
import { FilterBlogDto, SortBlogDto } from 'src/blogs/dto/query-blog.dto';
import { UserMapper } from 'src/users/infrastructure/persistence/document/mappers/user.mapper';
import { TagMapper } from 'src/tags/infrastructure/persistence/document/mappers/tag.mapper';

@Injectable()
export class BlogsDocumentRepository implements BlogRepository {
  constructor(
    @InjectModel(BlogSchemaClass.name)
    private readonly blogsModel: Model<BlogSchemaClass>,
  ) {}

  async create(data: Blog): Promise<Blog> {
    const persistenceModel = BlogMapper.toPersistence(data);
    const createdBlog = new this.blogsModel(persistenceModel);
    const blogObject = await createdBlog.save();
    return BlogMapper.toDomain(blogObject);
  }

  async findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterBlogDto | null;
    sortOptions?: SortBlogDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<Blog[]> {
    const where: EntityCondition<Blog> = {
      isDeleted: false,
    };

    if (filterOptions?.tagIds) {
      where.tags = filterOptions.tagIds as unknown as string[];
    }

    const blogObjects = await this.blogsModel
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
      .populate({
        path: 'tags',
        transform: TagMapper.toDomain,
      })
      .lean();

    return blogObjects.map((blogObject) => BlogMapper.toDomain(blogObject));
  }

  async findOne(fields: EntityCondition<Blog>): Promise<NullableType<Blog>> {
    if (fields.id) {
      const blogObject = await this.blogsModel
        .findById(fields.id)
        .populate({
          path: 'author',
          transform: UserMapper.toDomain,
        })
        .populate({
          path: 'tags',
          transform: TagMapper.toDomain,
        })
        .lean();

      return blogObject ? BlogMapper.toDomain(blogObject) : null;
    }

    const blogObject = await this.blogsModel.findOne(fields);
    return blogObject ? BlogMapper.toDomain(blogObject) : null;
  }

  async getSeo(slug: string) {
    return await this.blogsModel
      .findOne({
        slug,
      })
      .select(['title', 'content', 'slug', 'banner'])
      .exec();
  }

  async update(id: Blog['id'], payload: Partial<Blog>): Promise<Blog | null> {
    const clonedPayload = { ...payload };

    delete clonedPayload.id;

    const filter = { _id: id };
    const blogObject = await this.blogsModel.findOneAndUpdate(
      filter,
      clonedPayload,
    );

    return blogObject ? BlogMapper.toDomain(blogObject) : null;
  }

  async softDelete(slug: Blog['slug']): Promise<void> {
    await this.blogsModel.deleteOne({
      slug,
    });
  }

  async deleteAll() {
    await this.blogsModel.deleteMany({});
  }
}
