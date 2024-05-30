import { Module } from '@nestjs/common';

import { DocumentBlogPersistenceModule } from './infrastructure/persistence/document/document-persistence.module';
import { TagsModule } from 'src/tags/tags.module';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { DocumentCommentPersistenceModule } from './infrastructure/persistence/document/document-persistence-comment.module';
import { SlugGeneratorModule } from 'src/slug-generator/slug-generator.module';
import { GlobalSearchModule } from 'src/global-search/global-search.module';

@Module({
  imports: [
    DocumentBlogPersistenceModule,
    DocumentCommentPersistenceModule,
    TagsModule,
    SlugGeneratorModule,
    GlobalSearchModule,
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
