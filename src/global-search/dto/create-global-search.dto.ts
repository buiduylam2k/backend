import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { GlobalSearchDomainUtils } from '../domain/utils';
import { Transform } from 'class-transformer';
import { lowerCaseTransformer } from 'src/utils/transformers/lower-case.transformer';

export class CreateGlobalSearchDto {
  @ApiProperty({ example: 'name of search' })
  @IsNotEmpty()
  @IsString()
  @Transform(lowerCaseTransformer)
  @MinLength(GlobalSearchDomainUtils.MIN_NAME_LENGTH)
  name: string;

  @ApiProperty({ example: 'blog' })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({ example: 'blog' })
  @IsString()
  @IsNotEmpty()
  originId: string;

  @ApiProperty({ example: 'blog' })
  @IsString()
  @IsNotEmpty()
  slug: string;
}
