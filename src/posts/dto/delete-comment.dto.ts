import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteCommentDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  cmtId: string;
}
