export class TotalOverview {
  user: number;
  post: number;
  blog: number;
  tag: number;
}

export class BaseMetric {
  id: string;
  name: string;
  value: number;
}

export class TotalMetric {
  post: BaseMetric[];
  blog: BaseMetric[];
}

export class MetricOverview {
  overview: TotalOverview;
  metric: TotalMetric;
}
