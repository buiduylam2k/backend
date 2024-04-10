import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Transform, Type, plainToInstance } from 'class-transformer';
import { Comment } from '../domain/comment';

export class FilterCommentDto {}

export class SortCommentDto {
  @ApiProperty()
  @Type(() => String)
  @IsString()
  orderBy: keyof Comment;

  @ApiProperty()
  @IsString()
  order: string;
}

export class QueryCommentDto {
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
    value ? plainToInstance(FilterCommentDto, JSON.parse(value)) : undefined,
  )
  @ValidateNested()
  @Type(() => FilterCommentDto)
  filters?: FilterCommentDto | null;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @Transform(({ value }) => {
    return value
      ? plainToInstance(SortCommentDto, JSON.parse(value))
      : undefined;
  })
  @ValidateNested({ each: true })
  @Type(() => SortCommentDto)
  sort?: SortCommentDto[] | null;
}
