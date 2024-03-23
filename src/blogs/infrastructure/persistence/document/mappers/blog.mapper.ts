import { BlogSchemaClass } from '../entities/blog.schema';
import { Blog } from 'src/blogs/domain/blog';

export class BlogMapper {
  static toDomain(raw: BlogSchemaClass): Blog {
    const blog = new Blog();
    blog.id = raw._id.toString();
    blog.title = raw.title;
    blog.content = raw.content;
    blog.createdAt = raw.createdAt;
    blog.updatedAt = raw.updatedAt;
    blog.isDeleted = raw.isDeleted;
    blog.author = raw.author;
    blog.tags = raw.tags;
    blog.views = raw.views;

    return blog;
  }

  static toPersistence(blog: Blog): BlogSchemaClass {
    const blogEntity = new BlogSchemaClass();

    blogEntity.title = blog.title;
    blogEntity.content = blog.content;
    blogEntity.createdAt = blog.createdAt;
    blogEntity.updatedAt = blog.updatedAt;
    blogEntity.isDeleted = blog.isDeleted;
    blogEntity.author = blog.author;
    blogEntity.tags = blog.tags;
    blogEntity.views = blog.views;

    return blogEntity;
  }
}
