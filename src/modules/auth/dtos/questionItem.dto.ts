import { ApiProperty } from '@nestjs/swagger';

export class QusetionItemDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  rating: number;

  @ApiProperty()
  author: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  tags: string;

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
