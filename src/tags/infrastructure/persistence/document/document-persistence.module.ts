import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TagSchema } from './entities/tag.schema';
import { TagRepository } from '../tag.repository';
import { TagsDocumentRepository } from './repositories/tag.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'TagSchemaClass', schema: TagSchema }]),
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
