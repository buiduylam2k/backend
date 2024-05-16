import { PartialType } from '@nestjs/swagger';

import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsOptional, ValidateNested } from 'class-validator';
import { CreatePostDto } from './create-post.dto';

export class UpdatePostDto extends PartialType(CreatePostDto) {
  @ApiPropertyOptional({ example: ['cbcfa8b8-3a25-4adb-a9c6-e325f0d0f3ae'] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  comments?: string[];
}
