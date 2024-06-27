import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';
import { QusetionItemDto } from './questionItem.dto';
import { AnswerItemDto } from './answerItem.dto';

export class UpdateBodyDto {
  @ApiProperty({
    example: 'example@gmail.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    type: [QusetionItemDto],
  })
  questions: QusetionItemDto[];

  @ApiProperty({
    type: [AnswerItemDto],
  })
  answers: AnswerItemDto[];
}
