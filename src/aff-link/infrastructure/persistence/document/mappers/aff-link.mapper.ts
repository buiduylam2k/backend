import { AffLink } from 'src/aff-link/domain/aff-link';
import { AffLinkSchemaClass } from '../entities/aff-link.schema';

export class AffLinkMapper {
  static toDomain(raw: AffLinkSchemaClass): AffLink {
    const affLink = new AffLink();
    affLink.id = raw._id.toString();
    affLink.link = raw.link;
    affLink.createdAt = raw.createdAt;
    affLink.updatedAt = raw.updatedAt;
    affLink.isActive = raw.isActive;
    affLink.time = raw.time;

    return affLink;
  }

  static toPersistence(affLink: AffLink): AffLinkSchemaClass {
    const affLinkEntity = new AffLinkSchemaClass();

    affLinkEntity.link = affLink.link;
    affLinkEntity.createdAt = affLink.createdAt;
    affLinkEntity.updatedAt = affLink.updatedAt;
    affLinkEntity.isActive = affLink.isActive;
    affLinkEntity.link = affLink.link;
    affLinkEntity.time = affLink.time;

    return affLinkEntity;
  }
}
