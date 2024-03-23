import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Transform, Type, plainToInstance } from 'class-transformer';
import { Tag } from '../domain/tag';

export class FilterTagDto {
  // @ApiPropertyOptional({ type: RoleDto })
  // @IsOptional()
  // @ValidateNested({ each: true })
  // @Type(() => RoleDto)
  // roles?: RoleDto[] | null;
}

export class SortTagDto {
  @ApiProperty()
  @Type(() => String)
  @IsString()
  orderBy: keyof Tag;

  @ApiProperty()
  @IsString()
  order: string;
}

export class QueryTagDto {
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
    value ? plainToInstance(FilterTagDto, JSON.parse(value)) : undefined,
  )
  @ValidateNested()
  @Type(() => FilterTagDto)
  filters?: FilterTagDto | null;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @Transform(({ value }) => {
    return value ? plainToInstance(SortTagDto, JSON.parse(value)) : undefined;
  })
  @ValidateNested({ each: true })
  @Type(() => SortTagDto)
  sort?: SortTagDto[] | null;
}
