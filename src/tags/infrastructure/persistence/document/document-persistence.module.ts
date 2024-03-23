import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TagSchema, TagSchemaClass } from './entities/tag.schema';
import { TagRepository } from '../tag.repository';
import { TagsDocumentRepository } from './repositories/tag.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TagSchemaClass.name, schema: TagSchema },
    ]),
  ],
  providers: [
    {
      provide: TagRepository,
      useClass: TagsDocumentRepository,
    },
  ],
  exports: [TagRepository],
})
export class DocumentTagPersistenceModule {}
