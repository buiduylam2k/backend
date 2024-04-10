import { Module } from '@nestjs/common';

import { DocumentBlogPersistenceModule } from './infrastructure/persistence/document/document-persistence.module';
import { TagsModule } from 'src/tags/tags.module';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { DocumentCommentPersistenceModule } from './infrastructure/persistence/document/document-persistence-comment.module';

@Module({
  imports: [
    DocumentBlogPersistenceModule,
    DocumentCommentPersistenceModule,
    TagsModule,
  ],
  controllers: [PostsController],
  providers: [PostsService],
  exports: [
    PostsService,
    DocumentBlogPersistenceModule,
    DocumentCommentPersistenceModule,
  ],
})
export class PostsModule {}
