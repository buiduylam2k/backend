import { PartialType } from '@nestjs/swagger';

import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Types } from 'mongoose';
import { CreatePostDto } from './create-post.dto';
import { PostDomainUtils } from '../domain/utils';

export class UpdatePostDto extends PartialType(CreatePostDto) {
  @ApiPropertyOptional()
  @IsNotEmpty()
  @IsString()
  @MinLength(PostDomainUtils.MIN_LENGTH_CONTENT)
  content: string;

  @ApiPropertyOptional({ example: 'cbcfa8b8-3a25-4adb-a9c6-e325f0d0f3ae' })
  @IsString()
  @Type(() => Types.ObjectId)
  banner: string;

  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => Types.ObjectId)
  tagIds?: Types.ObjectId[];

  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => Types.ObjectId)
  comments?: Types.ObjectId[];
}
