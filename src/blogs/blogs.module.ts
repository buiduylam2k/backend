import { Module } from '@nestjs/common';

import { DocumentBlogPersistenceModule } from './infrastructure/persistence/document/document-persistence.module';
import { BlogsService } from './blogs.service';
import { BlogsController } from './blogs.controller';
import { TagsModule } from 'src/tags/tags.module';

@Module({
  imports: [DocumentBlogPersistenceModule, TagsModule],
  controllers: [BlogsController],
  providers: [BlogsService],
  exports: [BlogsService, DocumentBlogPersistenceModule],
})
export class BlogsModule {}
