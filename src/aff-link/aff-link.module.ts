import { Module } from '@nestjs/common';

import { DocumentTagPersistenceModule } from './infrastructure/persistence/document/document-persistence.module';
import { UsersModule } from 'src/users/users.module';
import { AffLinkController } from './aff-link.controller';
import { AffLinkService } from './aff-link.service';

@Module({
  imports: [DocumentTagPersistenceModule, UsersModule],
  controllers: [AffLinkController],
  providers: [AffLinkService],
  exports: [AffLinkService, DocumentTagPersistenceModule],
})
export class AffLinkModule {}
