import { ApiProperty } from '@nestjs/swagger';

export class AnswerItemDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  rating: number;

  @ApiProperty()
  author: string;

  @ApiProperty()
  text: string;

  @ApiProperty({
    type: String,
    default: new Date(),
  })
  createdAt: Date;

  @ApiProperty({
    type: String,
    default: new Date(),
  })
  updatedAt: Date;
}
