import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class QuestionQueryDto {
  @ApiProperty({ required: false })
  @IsOptional()
  q?: string;
}
