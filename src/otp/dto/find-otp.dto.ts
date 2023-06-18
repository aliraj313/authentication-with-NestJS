import {
  IsNotEmpty,
  IsNumberString,
  IsPhoneNumber,
  Length,
} from 'class-validator';

export class FindOtpDto {
  @Length(6,6)
  @IsNumberString()
  @IsNotEmpty()
  code: number;

  @IsPhoneNumber('IR')
  @IsNumberString()
  @IsNotEmpty()
  number: string;
}
