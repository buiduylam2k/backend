import { Module } from '@nestjs/common';
import { DocumentMetricsPersistenceModule } from './infrastructure/persistence/document/document-persistence.module';
import { MetricsController } from './metrics.controller';
import { MetricsService } from './metrics.service';
import { UsersModule } from 'src/users/users.module';
import { PostsModule } from 'src/posts/posts.module';
import { BlogsModule } from 'src/blogs/blogs.module';
import { TagsModule } from 'src/tags/tags.module';

@Module({
  imports: [
    DocumentMetricsPersistenceModule,
    UsersModule,
    PostsModule,
    BlogsModule,
    TagsModule,
  ],
  controllers: [MetricsController],
  providers: [MetricsService],
  exports: [MetricsService, DocumentMetricsPersistenceModule],
})
export class MetricsModule {}
