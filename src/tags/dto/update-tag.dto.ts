import { PartialType } from '@nestjs/swagger';

import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { CreateTagDto } from './create-tag.dto';
import { TagDomainUtils } from '../domain/utils';

export class UpdateTagDto extends PartialType(CreateTagDto) {
  @ApiPropertyOptional({ example: 'create my blog' })
  @IsNotEmpty()
  @IsString()
  @MinLength(TagDomainUtils.MIN_LENGTH_NAME)
  name: string;
}
