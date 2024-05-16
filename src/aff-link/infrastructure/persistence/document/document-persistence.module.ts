import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AffLinkSchema } from './entities/aff-link.schema';
import { AffLinkRepository } from '../aff-link.repository';
import { AffLinkDocumentRepository } from './repositories/aff-link.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'AffLinkSchemaClass', schema: AffLinkSchema },
    ]),
  ],
  providers: [
    {
      provide: AffLinkRepository,
      useClass: AffLinkDocumentRepository,
    },
  ],
  exports: [AffLinkRepository],
})
export class DocumentTagPersistenceModule {}
