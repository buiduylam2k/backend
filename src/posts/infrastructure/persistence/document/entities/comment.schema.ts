import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { now, HydratedDocument, Types } from 'mongoose';
import { Type } from 'class-transformer';
import { EntityDocumentHelper } from 'src/utils/document-entity-helper';
import { UserSchemaClass } from 'src/users/infrastructure/persistence/document/entities/user.schema';
import { PostSchemaClass } from 'src/posts/infrastructure/persistence/document/entities/post.schema';

export type CommentSchemaDocument = HydratedDocument<CommentSchemaClass>;

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    getters: true,
  },
})
export class CommentSchemaClass extends EntityDocumentHelper {
  @Prop()
  content: string;

  @Prop({ default: now })
  createdAt: Date;

  @Prop({ default: now })
  updatedAt: Date;

  @Prop({
    default: false,
  })
  isDeleted: boolean;

  @Prop({ type: Types.ObjectId, ref: 'UserSchemaClass' })
  @Type(() => UserSchemaClass)
  author: string;

  @Prop({ type: Types.ObjectId, ref: 'PostSchemaClass' })
  @Type(() => PostSchemaClass)
  post: string;
}

export const CommentSchema = SchemaFactory.createForClass(CommentSchemaClass);
