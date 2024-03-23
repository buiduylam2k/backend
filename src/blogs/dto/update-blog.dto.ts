import { PartialType } from '@nestjs/swagger';

import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { CreateBlogDto } from './create-blog.dto';
import { BlogDomainUtils } from '../domain/utils';
import { Type } from 'class-transformer';
import { Types } from 'mongoose';

export class UpdateBlogDto extends PartialType(CreateBlogDto) {
  @ApiPropertyOptional({ example: 'create my blog' })
  @IsNotEmpty()
  @IsString()
  @MinLength(BlogDomainUtils.MIN_LENGTH_TITLE)
  title: string;

  @ApiPropertyOptional()
  @IsNotEmpty()
  @IsString()
  @MinLength(BlogDomainUtils.MIN_LENGTH_CONTENT)
  content: string;

  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => Types.ObjectId)
  tagIds?: Types.ObjectId[];
}
