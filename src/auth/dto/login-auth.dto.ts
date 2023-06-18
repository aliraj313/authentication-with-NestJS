import { IsNumberString, IsPhoneNumber, Length } from "class-validator";

export class LoginAuthDto {
    @IsPhoneNumber("IR")
    @IsNumberString()
    number:string;

    @Length(8,20)
    password:string;
}
