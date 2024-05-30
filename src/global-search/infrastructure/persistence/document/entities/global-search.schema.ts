import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { now, HydratedDocument } from 'mongoose';
import { EntityDocumentHelper } from 'src/utils/document-entity-helper';

export type GlobalSearchSchemaDocument =
  HydratedDocument<GlobalSearchSchemaClass>;

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    getters: true,
  },
})
export class GlobalSearchSchemaClass extends EntityDocumentHelper {
  @Prop()
  name: string;

  @Prop()
  type: string;

  @Prop({ default: now })
  createdAt: Date;

  @Prop({ default: now })
  updatedAt: Date;

  @Prop()
  originId: string;
  
  @Prop()
  slug: string;
}

export const GlobalSearchSchema = SchemaFactory.createForClass(
  GlobalSearchSchemaClass,
);
