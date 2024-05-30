import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GlobalSearchSchema } from './entities/global-search.schema';
import { GlobalSearchRepository } from '../global-search.repository';
import { GlobalSearchDocumentRepository } from './repositories/global-search.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'GlobalSearchSchemaClass', schema: GlobalSearchSchema },
    ]),
  ],
  providers: [
    {
      provide: GlobalSearchRepository,
      useClass: GlobalSearchDocumentRepository,
    },
  ],
  exports: [GlobalSearchRepository],
})
export class DocumentGlobalSearchPersistenceModule {}
