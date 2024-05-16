import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, IsUrl } from 'class-validator';

export class CreateAffLinkDto {
  @ApiProperty({ example: 'https://shopee.com' })
  @IsNotEmpty()
  @IsString()
  @IsUrl()
  link: string;

  @ApiProperty({ example: 30 })
  @IsNotEmpty()
  @IsNumber()
  time: number;
}
