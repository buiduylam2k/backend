import { Comment } from 'src/posts/domain/comment';
import { CommentSchemaClass } from '../entities/comment.schema';

export class CommentMapper {
  static toDomain(raw: CommentSchemaClass): Comment {
    const comment = new Comment();
    comment.id = raw._id.toString();
    comment.content = raw.content;
    comment.createdAt = raw.createdAt;
    comment.updatedAt = raw.updatedAt;
    comment.isDeleted = raw.isDeleted;
    comment.author = raw.author;
    comment.post = raw.post;

    return comment;
  }

  static toPersistence(comment: Comment): CommentSchemaClass {
    const commentEntity = new CommentSchemaClass();

    commentEntity.content = comment.content;
    commentEntity.createdAt = comment.createdAt;
    commentEntity.updatedAt = comment.updatedAt;
    commentEntity.isDeleted = comment.isDeleted;
    commentEntity.author = comment.author;
    commentEntity.post = comment.post;

    return commentEntity;
  }
}
