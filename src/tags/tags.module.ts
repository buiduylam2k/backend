import { Module } from '@nestjs/common';

import { DocumentTagPersistenceModule } from './infrastructure/persistence/document/document-persistence.module';
import { TagsController } from './tags.controller';
import { TagsService } from './tags.service';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [DocumentTagPersistenceModule, UsersModule],
  controllers: [TagsController],
  providers: [TagsService],
  exports: [TagsService, DocumentTagPersistenceModule],
})
export class TagsModule {}
