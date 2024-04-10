import { NullableType } from 'src/utils/types/nullable.type';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { DeepPartial } from 'src/utils/types/deep-partial.type';
import {
  FilterCommentDto,
  SortCommentDto,
} from 'src/posts/dto/query-comment.dto';
import { Comment } from 'src/posts/domain/comment';

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
