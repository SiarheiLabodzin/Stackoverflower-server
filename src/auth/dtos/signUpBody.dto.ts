import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class SignUpBodyDto {
  @ApiProperty({
    example: 'example@gmail.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '12345678',
  })
  @IsNotEmpty()
  password: string;
}
