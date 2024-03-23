import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Transform, Type, plainToInstance } from 'class-transformer';
import { Blog } from '../domain/blog';
import { Types } from 'mongoose';

export class FilterBlogDto {
  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => Types.ObjectId)
  tagIds?: Types.ObjectId[];
}

export class SortBlogDto {
  @ApiProperty()
  @Type(() => String)
  @IsString()
  orderBy: keyof Blog;

  @ApiProperty()
  @IsString()
  order: string;
}

export class QueryBlogDto {
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
    value ? plainToInstance(FilterBlogDto, JSON.parse(value)) : undefined,
  )
  @ValidateNested()
  @Type(() => FilterBlogDto)
  filters?: FilterBlogDto | null;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @Transform(({ value }) => {
    return value ? plainToInstance(SortBlogDto, JSON.parse(value)) : undefined;
  })
  @ValidateNested({ each: true })
  @Type(() => SortBlogDto)
  sort?: SortBlogDto[] | null;
}
