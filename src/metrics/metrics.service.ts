import { Injectable } from '@nestjs/common';
import { MetricsRepository } from './infrastructure/persistence/metrics.repository';
import { CreateMetricsDto } from './dto/create-metrics.dto';
import { UserRepository } from 'src/users/infrastructure/persistence/user.repository';
import { PostRepository } from 'src/posts/infrastructure/persistence/post.repository';
import {
  BaseMetric,
  MetricOverview,
  TotalMetric,
  TotalOverview,
} from './domain/overview';
import { BlogRepository } from 'src/blogs/infrastructure/persistence/blog.repository';
import { TagRepository } from 'src/tags/infrastructure/persistence/tag.repository';
import { Metrics } from './domain/metrics';
import { METRICS_ENUM } from './domain/enum';
import _ from 'lodash';

@Injectable()
export class MetricsService {
  constructor(
    private readonly metricsRepository: MetricsRepository,
    private readonly usersRepository: UserRepository,
    private readonly postsRepository: PostRepository,
    private readonly blogsRepository: BlogRepository,
    private readonly tagsRepository: TagRepository,
  ) {}

  async create(createMetricsDto: CreateMetricsDto): Promise<Metrics> {
    return this.metricsRepository.create(createMetricsDto);
  }

  async overview(): Promise<MetricOverview> {
    const overview: TotalOverview = {
      user: await this.usersRepository.total(),
      blog: await this.blogsRepository.total(),
      post: await this.postsRepository.total(),
      tag: await this.tagsRepository.total(),
    };

    const postMetrics = await this.metricsRepository.find({
      type: METRICS_ENUM.POST_VIEW,
    });

    const blogMetrics = await this.metricsRepository.find({
      type: METRICS_ENUM.BLOG_VIEW,
    });

    const groupPosts = _.groupBy(postMetrics, 'originId');
    const groupBlogs = _.groupBy(blogMetrics, 'originId');

    const metric: TotalMetric = {
      blog: [],
      post: [],
    };

    const tmpPost: BaseMetric[] = [];
    const tmpBlog: BaseMetric[] = [];

    Object.entries(groupPosts).forEach(([k, v]) => {
      tmpPost.push({
        id: k,
        name: v[0]?.name,
        value: v.length,
      });
    });

    Object.entries(groupBlogs).forEach(([k, v]) => {
      tmpBlog.push({
        id: k,
        name: v[0]?.name,
        value: v.length,
      });
    });

    metric.post = _.orderBy(tmpPost, ['value'], ['desc']).slice(0, 12);
    metric.blog = _.orderBy(tmpBlog, ['value'], ['desc']).slice(0, 12);

    return {
      overview,
      metric,
    };
  }
}
