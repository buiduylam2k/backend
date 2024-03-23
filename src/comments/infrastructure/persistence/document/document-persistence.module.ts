import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentSchema } from './entities/comment.schema';
import { CommentRepository } from '../comment.repository';
import { CommentsDocumentRepository } from './repositories/comment.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'CommentSchemaClass', schema: CommentSchema },
    ]),
  ],
  providers: [
    {
      provide: CommentRepository,
      useClass: CommentsDocumentRepository,
    },
  ],
  exports: [CommentRepository],
})
export class DocumentBlogPersistenceModule {}
