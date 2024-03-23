import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { now, HydratedDocument, Types } from 'mongoose';
import { Expose, Type } from 'class-transformer';
import { EntityDocumentHelper } from 'src/utils/document-entity-helper';
import { UserSchemaClass } from 'src/users/infrastructure/persistence/document/entities/user.schema';
import { TagSchemaClass } from 'src/tags/infrastructure/persistence/document/entities/tag.schema';
import { CommentSchemaClass } from 'src/comments/infrastructure/persistence/document/entities/comment.schema';

export type PostSchemaDocument = HydratedDocument<PostSchemaClass>;

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    getters: true,
  },
})
export class PostSchemaClass extends EntityDocumentHelper {
  @Prop()
  @Expose({ groups: ['me', 'admin'], toPlainOnly: true })
  content: string;

  @Prop()
  @Expose({ groups: ['me', 'admin'], toPlainOnly: true })
  banner: string;

  @Prop()
  @Expose({ groups: ['me', 'admin'], toPlainOnly: true })
  views: number;

  @Prop({ default: now })
  createdAt: Date;

  @Prop({ default: now })
  updatedAt: Date;

  @Prop()
  isDeleted: boolean;

  @Prop({ type: Types.ObjectId, ref: 'UserSchemaClass' })
  @Type(() => UserSchemaClass)
  author: string;

  @Prop({ type: [Types.ObjectId], ref: 'TagSchemaClass' })
  @Type(() => TagSchemaClass)
  tags: string[];

  @Prop({ type: [Types.ObjectId], ref: 'CommentSchemaClass' })
  @Type(() => CommentSchemaClass)
  comments: string[];
}

export const PostSchema = SchemaFactory.createForClass(PostSchemaClass);
