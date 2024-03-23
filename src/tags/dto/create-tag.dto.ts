import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { TagDomainUtils } from '../domain/utils';
import { Transform } from 'class-transformer';
import { lowerCaseTransformer } from 'src/utils/transformers/lower-case.transformer';

export class CreateTagDto {
  @ApiProperty({ example: 'create my tag' })
  @IsNotEmpty()
  @IsString()
  @Transform(lowerCaseTransformer)
  @MinLength(TagDomainUtils.MIN_LENGTH_NAME)
  name: string;
}
