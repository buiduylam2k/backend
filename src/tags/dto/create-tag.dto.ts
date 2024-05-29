import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';
import { TagDomainUtils } from '../domain/utils';
import { TagEnum } from '../domain/enum';

export class CreateTagDto {
  @ApiProperty({ example: 'create my tag' })
  @IsNotEmpty()
  @IsString()
  @MinLength(TagDomainUtils.MIN_LENGTH_NAME)
  name: string;

  @ApiProperty({ enum: TagEnum })
  @IsEnum(TagEnum)
  @IsNotEmpty()
  type: TagEnum;

  @ApiPropertyOptional({ example: false })
  @IsNotEmpty()
  @IsBoolean()
  isActiveNav: boolean;
}
