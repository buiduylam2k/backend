import { Module } from '@nestjs/common';

import { DocumentBlogPersistenceModule } from './infrastructure/persistence/document/document-persistence.module';
import { BlogsService } from './blogs.service';
import { BlogsController } from './blogs.controller';
import { TagsModule } from 'src/tags/tags.module';
import { SlugGeneratorModule } from 'src/slug-generator/slug-generator.module';

@Module({
  imports: [DocumentBlogPersistenceModule, TagsModule, SlugGeneratorModule],
  controllers: [BlogsController],
  providers: [BlogsService],
  exports: [BlogsService, DocumentBlogPersistenceModule],
})
export class BlogsModule {}
