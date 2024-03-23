import { Module } from '@nestjs/common';

import { DocumentBlogPersistenceModule } from './infrastructure/persistence/document/document-persistence.module';
import { TagsModule } from 'src/tags/tags.module';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';

@Module({
  imports: [DocumentBlogPersistenceModule, TagsModule],
  controllers: [PostsController],
  providers: [PostsService],
  exports: [PostsService, DocumentBlogPersistenceModule],
})
export class PostsModule {}
