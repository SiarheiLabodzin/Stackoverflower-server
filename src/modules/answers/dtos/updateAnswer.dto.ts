import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateAnswerDto {
  @ApiProperty({
    example: 'Text',
  })
  @IsString()
  text: string;
}
