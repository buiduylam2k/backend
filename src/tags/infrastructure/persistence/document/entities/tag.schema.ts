import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { now, HydratedDocument, Types } from 'mongoose';
import { Expose, Type } from 'class-transformer';
import { EntityDocumentHelper } from 'src/utils/document-entity-helper';
import { UserSchemaClass } from 'src/users/infrastructure/persistence/document/entities/user.schema';

export type TagSchemaDocument = HydratedDocument<TagSchemaClass>;

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    getters: true,
  },
})
export class TagSchemaClass extends EntityDocumentHelper {
  @Prop()
  @Expose({ groups: ['me', 'admin'], toPlainOnly: true })
  name: string;

  @Prop({ default: now })
  createdAt: Date;

  @Prop({ default: now })
  updatedAt: Date;

  @Prop()
  isDeleted: boolean;

  @Prop({ type: Types.ObjectId, ref: 'UserSchemaClass' })
  @Type(() => UserSchemaClass)
  author: string;
}

export const TagSchema = SchemaFactory.createForClass(TagSchemaClass);

TagSchema.index({ name: 1 });
