import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class InsertPostCsvDto {
  @ApiProperty({ example: 'password admin' })
  @IsNotEmpty()
  @IsString()
  pwd: string;
}
