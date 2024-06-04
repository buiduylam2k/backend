import { MetricsSchemaClass } from '../entities/metrics.schema';
import { Metrics } from 'src/metrics/domain/metrics';

export class MetricsMapper {
  static toDomain(raw: MetricsSchemaClass): Metrics {
    const metrics = new Metrics();
    metrics.id = raw._id.toString();
    metrics.createdAt = raw.createdAt;
    metrics.updatedAt = raw.updatedAt;
    metrics.type = raw.type;
    metrics.name = raw.name;
    metrics.originId = raw.originId;

    return metrics;
  }

  static toPersistence(metrics: Metrics): MetricsSchemaClass {
    const metricsEntity = new MetricsSchemaClass();

    metricsEntity.type = metrics.type;
    metricsEntity.createdAt = metrics.createdAt;
    metricsEntity.updatedAt = metrics.updatedAt;
    metricsEntity.name = metrics.name;
    metricsEntity.originId = metrics.originId;

    return metricsEntity;
  }
}
