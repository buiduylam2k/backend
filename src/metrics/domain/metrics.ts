import { METRICS_ENUM } from './enum';

export class Metrics {
  id: number | string;

  type: METRICS_ENUM;

  createdAt: Date;
  updatedAt: Date;
}
