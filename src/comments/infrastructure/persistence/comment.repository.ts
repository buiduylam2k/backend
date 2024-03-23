import { NullableType } from 'src/utils/types/nullable.type';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { DeepPartial } from 'src/utils/types/deep-partial.type';
import { Comment } from 'src/comments/domain/comment';
import {
  FilterCommentDto,
  SortCommentDto,
} from 'src/comments/dto/query-comment.dto';

export abstract class CommentRepository {
  abstract create(
    data: Omit<Comment, 'id' | 'createdAt' | 'isDeleted' | 'updatedAt'>,
  ): Promise<Comment>;

  abstract findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterCommentDto | null;
    sortOptions?: SortCommentDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<Comment[]>;

  abstract findOne(
    fields: EntityCondition<Comment>,
  ): Promise<NullableType<Comment>>;

  abstract update(
    id: Comment['id'],
    payload: DeepPartial<Comment>,
  ): Promise<Comment | null>;

  abstract softDelete(id: Comment['id']): Promise<void>;
}
