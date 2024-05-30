import { GlobalSearch } from 'src/global-search/domain/global-search';
import { GlobalSearchSchemaClass } from '../entities/global-search.schema';

export class GlobalSearchMapper {
  static toDomain(raw: GlobalSearchSchemaClass): GlobalSearch {
    const tag = new GlobalSearch();

    tag.id = raw._id.toString();
    tag.name = raw.name;
    tag.createdAt = raw.createdAt;
    tag.updatedAt = raw.updatedAt;
    tag.type = raw.type;
    tag.originId = raw.originId;
    tag.slug = raw.slug

    return tag;
  }

  static toPersistence(tag: GlobalSearch): GlobalSearchSchemaClass {
    const tagEntity = new GlobalSearchSchemaClass();

    tagEntity.name = tag.name;
    tagEntity.createdAt = tag.createdAt;
    tagEntity.updatedAt = tag.updatedAt;
    tagEntity.type = tag.type;
    tagEntity.originId = tag.originId;
    tagEntity.slug = tag.slug


    return tagEntity;
  }
}
