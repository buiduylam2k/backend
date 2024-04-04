import { Tag } from 'src/tags/domain/tag';
import { TagSchemaClass } from '../entities/tag.schema';

export class TagMapper {
  static toDomain(raw: TagSchemaClass): Tag {
    const tag = new Tag();
    tag.id = raw._id.toString();
    tag.name = raw.name;
    tag.createdAt = raw.createdAt;
    tag.updatedAt = raw.updatedAt;
    tag.isDeleted = raw.isDeleted;
    tag.author = raw.author;

    return tag;
  }

  static toPersistence(tag: Tag): TagSchemaClass {
    const tagEntity = new TagSchemaClass();

    tagEntity.name = tag.name;
    tagEntity.createdAt = tag.createdAt;
    tagEntity.updatedAt = tag.updatedAt;
    tagEntity.isDeleted = tag.isDeleted;
    tagEntity.author = tag.author;

    return tagEntity;
  }
}
