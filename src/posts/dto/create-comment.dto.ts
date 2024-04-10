import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { CommentDomainUtils } from '../domain/utils';

export class CreateCommentDto {
  @ApiProperty({ example: 'Hello world' })
  @IsNotEmpty()
  @IsString()
  @MinLength(CommentDomainUtils.MIN_LENGTH_CONTENT)
  content: string;
}
