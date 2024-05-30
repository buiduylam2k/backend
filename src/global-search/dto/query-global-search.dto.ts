import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Transform, Type, plainToInstance } from 'class-transformer';
import { GlobalSearch } from '../domain/global-search';

export class FilterGlobalSearchDto {
  @ApiPropertyOptional()
  @IsOptional()
  name?: string;
}

export class SortGlobalSearchDto {
  @ApiProperty()
  @Type(() => String)
  @IsString()
  orderBy: keyof GlobalSearch;

  @ApiProperty()
  @IsString()
  order: string;
}

export class QueryGlobalSearchDto {
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
    value
      ? plainToInstance(FilterGlobalSearchDto, JSON.parse(value))
      : undefined,
  )
  @ValidateNested()
  @Type(() => FilterGlobalSearchDto)
  filters?: FilterGlobalSearchDto | null;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @Transform(({ value }) => {
    return value
      ? plainToInstance(SortGlobalSearchDto, JSON.parse(value))
      : undefined;
  })
  @ValidateNested({ each: true })
  @Type(() => SortGlobalSearchDto)
  sort?: SortGlobalSearchDto[] | null;
}
