import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { now, HydratedDocument } from 'mongoose';
import { EntityDocumentHelper } from 'src/utils/document-entity-helper';

export type AffLinkSchemaDocument = HydratedDocument<AffLinkSchemaClass>;

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    getters: true,
  },
})
export class AffLinkSchemaClass extends EntityDocumentHelper {
  @Prop()
  link: string;

  @Prop({ default: 30 })
  time: number;

  @Prop({ default: false })
  isActive: boolean;

  @Prop({ default: now })
  createdAt: Date;

  @Prop({ default: now })
  updatedAt: Date;
}

export const AffLinkSchema = SchemaFactory.createForClass(AffLinkSchemaClass);
