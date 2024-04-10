import { Post } from 'src/posts/domain/post';
import { PostSchemaClass } from '../entities/post.schema';

export class PostMapper {
  static toDomain(raw: PostSchemaClass): Post {
    const post = new Post();
    post.id = raw._id.toString();
    post.title = raw.title;
    post.content = raw.content;
    post.banner = raw.banner;
    post.createdAt = raw.createdAt;
    post.updatedAt = raw.updatedAt;
    post.isDeleted = raw.isDeleted;
    post.author = raw.author;
    post.tags = raw.tags;
    post.views = raw.views;
    post.comments = raw.comments;

    return post;
  }

  static toPersistence(post: Post): PostSchemaClass {
    const postEntity = new PostSchemaClass();

    postEntity.title = post.title;
    postEntity.content = post.content;
    postEntity.banner = post.banner;
    postEntity.createdAt = post.createdAt;
    postEntity.updatedAt = post.updatedAt;
    postEntity.isDeleted = post.isDeleted;
    postEntity.author = post.author;
    postEntity.tags = post.tags;
    postEntity.views = post.views;
    postEntity.comments = post.comments;

    return postEntity;
  }
}
