import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateQuestionDto {
  @ApiProperty({
    example: 'TitleExample',
  })
  @IsString()
  title: string;

  @ApiProperty({
    example: 'DescriptionExample',
  })
  @IsString()
  description: string;

  @ApiProperty({
    example: 'TagsExample',
  })
  @IsString()
  tags: string;
}
