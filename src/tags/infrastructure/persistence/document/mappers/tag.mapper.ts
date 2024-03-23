import { Tag } from 'src/tags/domain/tag';
import { TagSchemaClass } from '../entities/tag.schema';

export class TagMapper {
  static toDomain(raw: TagSchemaClass): Tag {
    const topic = new Tag();
    topic.id = raw._id.toString();
    topic.name = raw.name;
    topic.createdAt = raw.createdAt;
    topic.updatedAt = raw.updatedAt;
    topic.isDeleted = raw.isDeleted;
    topic.author = raw.author;

    return topic;
  }

  static toPersistence(topic: Tag): TagSchemaClass {
    const topicEntity = new TagSchemaClass();

    topicEntity.name = topic.name;
    topicEntity.createdAt = topic.createdAt;
    topicEntity.updatedAt = topic.updatedAt;
    topicEntity.isDeleted = topic.isDeleted;
    topicEntity.author = topic.author;

    return topicEntity;
  }
}
