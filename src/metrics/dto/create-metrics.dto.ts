import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { METRICS_ENUM } from '../domain/enum';

export class CreateMetricsDto {
  @ApiProperty({ example: METRICS_ENUM.VISIT_PAGE })
  @IsNotEmpty()
  @IsString()
  @IsEnum(METRICS_ENUM)
  type: METRICS_ENUM;
}
