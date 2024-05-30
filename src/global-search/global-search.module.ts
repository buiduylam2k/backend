import { Module } from '@nestjs/common';
import { GlobalSearchService } from './global-search.service';
import { GlobalSearchController } from './global-search.controller';
import { DocumentGlobalSearchPersistenceModule } from './infrastructure/persistence/document/document-persistence.module';

@Module({
  imports: [DocumentGlobalSearchPersistenceModule],
  controllers: [GlobalSearchController],
  providers: [GlobalSearchService],
  exports: [GlobalSearchService, DocumentGlobalSearchPersistenceModule],
})
export class GlobalSearchModule {}
