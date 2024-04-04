import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { now, HydratedDocument, Types } from 'mongoose';
import { Type } from 'class-transformer';
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
  @Prop({
    unique: true,
    index: true,
  })
  title: string;

  @Prop()
  content: string;

  @Prop()
  views: number;

  @Prop({
    unique: true,
    index: true,
  })
  slug: string;

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

  @Prop({ type: [Types.ObjectId], ref: 'TagSchemaClass' })
  @Type(() => TagSchemaClass)
  tags: string[];
}

export const BlogSchema = SchemaFactory.createForClass(BlogSchemaClass);
