import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogSchema } from './entities/blog.schema';
import { BlogRepository } from '../blog.repository';
import { BlogsDocumentRepository } from './repositories/blog.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'BlogSchemaClass', schema: BlogSchema },
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
