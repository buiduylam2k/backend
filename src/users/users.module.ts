import { Module } from '@nestjs/common';

import { UsersController } from './users.controller';
import { FilesModule } from 'src/files/files.module';
import { UsersService } from './users.service';
import { DocumentUserPersistenceModule } from './infrastructure/persistence/document/document-persistence.module';

@Module({
  imports: [DocumentUserPersistenceModule, FilesModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService, DocumentUserPersistenceModule],
})
export class UsersModule {}
