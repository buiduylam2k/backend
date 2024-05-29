import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Transform, Type, plainToInstance } from 'class-transformer';
import { METRICS_ENUM } from '../domain/enum';
import { Metrics } from '../domain/metrics';

export class FilterMetricsDto {
  @ApiPropertyOptional({ type: METRICS_ENUM })
  @IsOptional()
  @ValidateNested({ each: true })
  @IsString()
  types?: METRICS_ENUM[] | null;
}

export class SortMetricsDto {
  @ApiProperty()
  @Type(() => String)
  @IsString()
  orderBy: keyof Metrics;

  @ApiProperty()
  @IsString()
  order: string;
}

export class QueryMetricsDto {
  @ApiPropertyOptional()
  @Transform(({ value }) => (value ? Number(value) : 1))
  @IsNumber()
  @IsOptional()
  page?: number;

  @ApiPropertyOptional()
  @Transform(({ value }) => (value ? Number(value) : 10))
  @IsNumber()
  @IsOptional()
  limit?: number;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @Transform(({ value }) =>
    value ? plainToInstance(FilterMetricsDto, JSON.parse(value)) : undefined,
  )
  @ValidateNested()
  @Type(() => FilterMetricsDto)
  filters?: FilterMetricsDto | null;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @Transform(({ value }) => {
    return value
      ? plainToInstance(SortMetricsDto, JSON.parse(value))
      : undefined;
  })
  @ValidateNested({ each: true })
  @Type(() => SortMetricsDto)
  sort?: SortMetricsDto[] | null;
}
