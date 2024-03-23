import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { CommentDomainUtils } from '../domain/utils';

export class CreateCommentDto {
  @ApiProperty({ example: 'Hello world' })
  @IsNotEmpty()
  @IsString()
  @MinLength(CommentDomainUtils.MIN_LENGTH_CONTENT)
  content: string;

  @ApiPropertyOptional({ example: 'cbcfa8b8-3a25-4adb-a9c6-e325f0d0f3ae' })
  @IsString()
  postId: string;
}
