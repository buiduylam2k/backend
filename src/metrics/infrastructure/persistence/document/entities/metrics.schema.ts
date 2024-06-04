import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { now, HydratedDocument } from 'mongoose';
import { EntityDocumentHelper } from 'src/utils/document-entity-helper';
import { METRICS_ENUM } from 'src/metrics/domain/enum';

export type MetricsSchemaDocument = HydratedDocument<MetricsSchemaClass>;

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    getters: true,
  },
})
export class MetricsSchemaClass extends EntityDocumentHelper {
  @Prop()
  type: METRICS_ENUM;

  @Prop()
  name: string;

  @Prop()
  originId: string;

  @Prop({ default: now })
  createdAt: Date;

  @Prop({ default: now })
  updatedAt: Date;
}

export const MetricsSchema = SchemaFactory.createForClass(MetricsSchemaClass);
