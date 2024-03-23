import { PartialType } from '@nestjs/swagger';

import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { Type } from 'class-transformer';
import { Types } from 'mongoose';
import { CommentDomainUtils } from '../domain/utils';
import { CreateCommentDto } from './create-comment.dto';

export class UpdateCommentDto extends PartialType(CreateCommentDto) {
  @ApiPropertyOptional()
  @IsNotEmpty()
  @IsString()
  @MinLength(CommentDomainUtils.MIN_LENGTH_CONTENT)
  content: string;

  @ApiPropertyOptional({ example: 'cbcfa8b8-3a25-4adb-a9c6-e325f0d0f3ae' })
  @IsString()
  @Type(() => Types.ObjectId)
  postId: string;
}
