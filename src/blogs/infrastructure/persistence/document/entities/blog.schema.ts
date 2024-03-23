import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { now, HydratedDocument, Types } from 'mongoose';
import { Expose, Type } from 'class-transformer';
import { EntityDocumentHelper } from 'src/utils/document-entity-helper';
import { UserSchemaClass } from 'src/users/infrastructure/persistence/document/entities/user.schema';
import { TagSchemaClass } from 'src/tags/infrastructure/persistence/document/entities/tag.schema';

export type BlogSchemaDocument = HydratedDocument<BlogSchemaClass>;

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    getters: true,
  },
})
export class BlogSchemaClass extends EntityDocumentHelper {
  @Prop()
  @Expose({ groups: ['me', 'admin'], toPlainOnly: true })
  title: string;

  @Prop()
  @Expose({ groups: ['me', 'admin'], toPlainOnly: true })
  content: string;

  @Prop()
  @Expose({ groups: ['me', 'admin'], toPlainOnly: true })
  views: number;

  @Prop({ default: now })
  createdAt: Date;

  @Prop({ default: now })
  updatedAt: Date;

  @Prop()
  isDeleted: boolean;

  @Prop({ type: Types.ObjectId, ref: UserSchemaClass.name })
  @Type(() => UserSchemaClass)
  author: string;

  @Prop({ type: [Types.ObjectId], ref: TagSchemaClass.name })
  @Type(() => TagSchemaClass)
  tags: string[];
}

export const BlogSchema = SchemaFactory.createForClass(BlogSchemaClass);

BlogSchema.index({ title: 1 });
