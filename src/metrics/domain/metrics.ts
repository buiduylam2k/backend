import { METRICS_ENUM } from './enum';

export class Metrics {
  id: number | string;

  type: METRICS_ENUM;
  name: string;
  originId: string;

  createdAt: Date;
  updatedAt: Date;
}
