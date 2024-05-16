import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Transform, Type, plainToInstance } from 'class-transformer';
import { AffLink } from '../domain/aff-link';

export class FilterAffLinkDto {}

export class SortAffLinkDto {
  @ApiProperty()
  @Type(() => String)
  @IsString()
  orderBy: keyof AffLink;

  @ApiProperty()
  @IsString()
  order: string;
}

export class QueryAffLinkDto {
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
    value ? plainToInstance(FilterAffLinkDto, JSON.parse(value)) : undefined,
  )
  @ValidateNested()
  @Type(() => FilterAffLinkDto)
  filters?: FilterAffLinkDto | null;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @Transform(({ value }) => {
    return value
      ? plainToInstance(SortAffLinkDto, JSON.parse(value))
      : undefined;
  })
  @ValidateNested({ each: true })
  @Type(() => SortAffLinkDto)
  sort?: SortAffLinkDto[] | null;
}
