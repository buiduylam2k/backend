import { Injectable } from '@nestjs/common';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Blog } from 'src/blogs/domain/blog';
import { UserMapper } from 'src/users/infrastructure/persistence/document/mappers/user.mapper';
import { PostRepository } from '../../post.repository';
import { PostSchemaClass } from '../entities/post.schema';
import { Post } from 'src/posts/domain/post';
import { PostMapper } from '../mappers/post.mapper';
import { FilterPostDto, SortPostDto } from 'src/posts/dto/query-post.dto';

@Injectable()
export class PostsDocumentRepository implements PostRepository {
  constructor(
    @InjectModel(PostSchemaClass.name)
    private readonly postsModel: Model<PostSchemaClass>,
  ) {}

  async create(data: Post): Promise<Post> {
    const persistenceModel = PostMapper.toPersistence(data);
    const createdPost = new this.postsModel(persistenceModel);
    const postObject = await createdPost.save();
    return PostMapper.toDomain(postObject);
  }

  async findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterPostDto | null;
    sortOptions?: SortPostDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<Post[]> {
    const where: EntityCondition<Post> = {};
    console.log('filterOptions', filterOptions);

    const postObjects = await this.postsModel
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
      .populate('tags')
      .lean();

    return postObjects.map((postObject) => PostMapper.toDomain(postObject));
  }

  async findOne(fields: EntityCondition<Post>): Promise<NullableType<Post>> {
    if (fields.id) {
      const postObject = await this.postsModel.findById(fields.id);
      return postObject ? PostMapper.toDomain(postObject) : null;
    }

    const postObject = await this.postsModel.findOne(fields);
    return postObject ? PostMapper.toDomain(postObject) : null;
  }

  async update(id: Post['id'], payload: Partial<Post>): Promise<Post | null> {
    const clonedPayload = { ...payload };
    delete clonedPayload.id;

    const filter = { _id: id };
    const postObject = await this.postsModel.findOneAndUpdate(
      filter,
      clonedPayload,
    );

    return postObject ? PostMapper.toDomain(postObject) : null;
  }

  async softDelete(id: Blog['id']): Promise<void> {
    // await this.postsModel.deleteOne({
    //   _id: id,
    // });

    await this.postsModel.findOneAndUpdate(
      {
        _id: id,
      },
      {
        isDeleted: true,
      },
    );
  }
}
