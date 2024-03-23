import { Injectable } from '@nestjs/common';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserMapper } from 'src/users/infrastructure/persistence/document/mappers/user.mapper';
import { CommentRepository } from '../../comment.repository';
import { CommentSchemaClass } from '../entities/comment.schema';
import { CommentMapper } from '../mappers/comment.mapper';
import { Comment } from 'src/comments/domain/comment';
import {
  FilterCommentDto,
  SortCommentDto,
} from 'src/comments/dto/query-comment.dto';
import { PostMapper } from 'src/posts/infrastructure/persistence/document/mappers/post.mapper';

@Injectable()
export class CommentsDocumentRepository implements CommentRepository {
  constructor(
    @InjectModel(CommentSchemaClass.name)
    private readonly commentsModel: Model<CommentSchemaClass>,
  ) {}

  async create(data: Comment): Promise<Comment> {
    const persistenceModel = CommentMapper.toPersistence(data);
    const createdComment = new this.commentsModel(persistenceModel);
    const postObject = await createdComment.save();
    return CommentMapper.toDomain(postObject);
  }

  async findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterCommentDto | null;
    sortOptions?: SortCommentDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<Comment[]> {
    const where: EntityCondition<Comment> = {
      isDeleted: false,
      ...filterOptions,
    };

    const commentObjects = await this.commentsModel
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
        path: 'post',
        transform: PostMapper.toDomain,
      })
      .lean();

    return commentObjects.map((postObject) =>
      CommentMapper.toDomain(postObject),
    );
  }

  async findOne(
    fields: EntityCondition<Comment>,
  ): Promise<NullableType<Comment>> {
    if (fields.id) {
      const commentObject = await this.commentsModel.findById(fields.id);
      return commentObject ? CommentMapper.toDomain(commentObject) : null;
    }

    const commentObject = await this.commentsModel.findOne(fields);
    return commentObject ? CommentMapper.toDomain(commentObject) : null;
  }

  async update(
    id: Comment['id'],
    payload: Partial<Comment>,
  ): Promise<Comment | null> {
    const clonedPayload = { ...payload };
    delete clonedPayload.id;

    const filter = { _id: id };
    const commentObject = await this.commentsModel.findOneAndUpdate(
      filter,
      clonedPayload,
    );

    return commentObject ? CommentMapper.toDomain(commentObject) : null;
  }

  async softDelete(id: Comment['id']): Promise<void> {
    // await this.commentsModel.deleteOne({
    //   _id: id,
    // });

    await this.commentsModel.findOneAndUpdate(
      {
        _id: id,
      },
      {
        isDeleted: true,
      },
    );
  }
}
