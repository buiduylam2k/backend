import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MetricsSchema } from './entities/metrics.schema';
import { MetricsRepository } from '../metrics.repository';
import { MetricsDocumentRepository } from './repositories/metrics.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'MetricsSchemaClass', schema: MetricsSchema },
    ]),
  ],
  providers: [
    {
      provide: MetricsRepository,
      useClass: MetricsDocumentRepository,
    },
  ],
  exports: [MetricsRepository],
})
export class DocumentMetricsPersistenceModule {}
