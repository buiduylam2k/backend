import { PartialType } from '@nestjs/swagger';

import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty } from 'class-validator';
import { CreateAffLinkDto } from './create-aff-link.dto';

export class UpdateAffLinkDto extends PartialType(CreateAffLinkDto) {
  @ApiPropertyOptional({ example: false })
  @IsNotEmpty()
  @IsBoolean()
  isActive: boolean;
}
