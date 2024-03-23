import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogSchema, BlogSchemaClass } from './entities/blog.schema';
import { BlogRepository } from '../blog.repository';
import { BlogsDocumentRepository } from './repositories/blog.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: BlogSchemaClass.name, schema: BlogSchema },
    ]),
  ],
  providers: [
    {
      provide: BlogRepository,
      useClass: BlogsDocumentRepository,
    },
  ],
  exports: [BlogRepository],
})
export class DocumentBlogPersistenceModule {}
