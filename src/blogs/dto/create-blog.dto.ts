import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { BlogDomainUtils } from '../domain/utils';

export class CreateBlogDto {
  @ApiProperty({ example: 'create my blog' })
  @IsNotEmpty()
  @IsString()
  @MinLength(BlogDomainUtils.MIN_LENGTH_TITLE)
  title: string;

  @ApiProperty({ example: 'Hello world' })
  @IsNotEmpty()
  @IsString()
  @MinLength(BlogDomainUtils.MIN_LENGTH_CONTENT)
  content: string;

  @ApiPropertyOptional({ example: 'cbcfa8b8-3a25-4adb-a9c6-e325f0d0f3ae' })
  @IsString()
  @IsNotEmpty()
  tag: string; // Array of tag names (strings)

  @ApiPropertyOptional({ example: 'cbcfa8b8-3a25-4adb-a9c6-e325f0d0f3ae' })
  @IsString()
  banner: string;
}
