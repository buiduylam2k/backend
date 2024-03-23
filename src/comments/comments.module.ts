import { Module } from '@nestjs/common';

import { DocumentBlogPersistenceModule } from './infrastructure/persistence/document/document-persistence.module';
import { TagsModule } from 'src/tags/tags.module';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';

@Module({
  imports: [DocumentBlogPersistenceModule, TagsModule],
  controllers: [CommentsController],
  providers: [CommentsService],
  exports: [CommentsService, DocumentBlogPersistenceModule],
})
export class CommentsModule {}
