import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { now, HydratedDocument, Types } from 'mongoose';
import { Type } from 'class-transformer';
import { EntityDocumentHelper } from 'src/utils/document-entity-helper';
import { UserSchemaClass } from 'src/users/infrastructure/persistence/document/entities/user.schema';
import { TagEnum } from 'src/tags/domain/enum';

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
  name: string;

  @Prop({
    enum: TagEnum,
  })
  type: TagEnum;

  @Prop({ default: now })
  createdAt: Date;

  @Prop({ default: now })
  updatedAt: Date;

  @Prop({
    default: false,
  })
  isDeleted: boolean;

  @Prop({
    default: false,
  })
  isActiveNav: boolean;

  @Prop({ type: Types.ObjectId, ref: 'UserSchemaClass' })
  @Type(() => UserSchemaClass)
  author: string;
}

export const TagSchema = SchemaFactory.createForClass(TagSchemaClass);
