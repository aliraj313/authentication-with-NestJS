import { IsNotEmpty, Length, isStrongPassword } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  name: string;

  number: string;

  @Length(8, 20)
  @IsNotEmpty()
  password: string;
}
