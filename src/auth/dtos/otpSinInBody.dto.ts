import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class OtpSignInBodyDto {
  @ApiProperty({
    example: '1234',
  })
  @IsNotEmpty()
  otp: string;
}
