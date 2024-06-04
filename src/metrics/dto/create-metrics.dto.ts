import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { METRICS_ENUM } from '../domain/enum';

export class CreateMetricsDto {
  @ApiProperty({ example: METRICS_ENUM.POST_VIEW })
  @IsNotEmpty()
  @IsString()
  @IsEnum(METRICS_ENUM)
  type: METRICS_ENUM;

  @ApiProperty({ example: 'name of post or blog' })
  @IsNotEmpty()
  @IsString()
  name: METRICS_ENUM;

  @ApiProperty({ example: 'id of post or blog' })
  @IsNotEmpty()
  @IsString()
  originId: METRICS_ENUM;
}
