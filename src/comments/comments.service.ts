import { Injectable } from '@nestjs/common';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import { NullableType } from '../utils/types/nullable.type';
import { CommentRepository } from './infrastructure/persistence/comment.repository';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Comment } from './domain/comment';
import { FilterCommentDto, SortCommentDto } from './dto/query-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentsService {
  constructor(private readonly commentsRepository: CommentRepository) {}

  async create(
    createCommentDto: CreateCommentDto,
    authorId: string,
  ): Promise<Comment> {
    const { content, postId } = createCommentDto;

    const clonedPayload = {
      content,
      isDeleted: false,
      author: authorId,
      post: postId,
    };

    return this.commentsRepository.create(clonedPayload);
  }

  findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterCommentDto | null;
    sortOptions?: SortCommentDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<Comment[]> {
    return this.commentsRepository.findManyWithPagination({
      filterOptions,
      sortOptions,
      paginationOptions,
    });
  }

  findOne(fields: EntityCondition<Comment>): Promise<NullableType<Comment>> {
    return this.commentsRepository.findOne(fields);
  }

  async update(
    id: Comment['id'],
    payload: UpdateCommentDto,
  ): Promise<Comment | null> {
    return this.commentsRepository.update(id, payload);
  }

  async softDelete(id: Comment['id']): Promise<void> {
    await this.commentsRepository.softDelete(id);
  }
}
