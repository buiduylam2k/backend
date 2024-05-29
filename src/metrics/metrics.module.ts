import { Module } from '@nestjs/common';
import { DocumentMetricsPersistenceModule } from './infrastructure/persistence/document/document-persistence.module';
import { MetricsController } from './metrics.controller';
import { MetricsService } from './metrics.service';

@Module({
  imports: [DocumentMetricsPersistenceModule],
  controllers: [MetricsController],
  providers: [MetricsService],
  exports: [MetricsService, DocumentMetricsPersistenceModule],
})
export class MetricsModule {}
