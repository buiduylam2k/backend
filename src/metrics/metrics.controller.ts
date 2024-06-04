import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  HttpStatus,
  HttpCode,
  SerializeOptions,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/roles/roles.guard';
import { Roles } from 'src/roles/roles.decorator';
import { RoleEnum } from 'src/roles/roles.enum';
import { MetricsService } from './metrics.service';
import { CreateMetricsDto } from './dto/create-metrics.dto';
import { Metrics } from './domain/metrics';

@ApiTags('Metrics')
@Controller({
  path: 'metrics',
  version: '1',
})
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  create(@Body() createMetricsDto: CreateMetricsDto): Promise<Metrics> {
    return this.metricsService.create(createMetricsDto);
  }

  @ApiBearerAuth()
  @Roles(RoleEnum.admin, RoleEnum.user)
  @SerializeOptions({
    groups: ['admin'],
  })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get('overview')
  @HttpCode(HttpStatus.OK)
  async overview() {
    return this.metricsService.overview();
  }
}
