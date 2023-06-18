import { TokenService } from './token.service';
import { OtpService } from './../otp/otp.service';
import { UserService } from './../user/user.service';
import { HttpStatus, Injectable } from '@nestjs/common';
import { BaseService } from 'src/base.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { ChangePasswordDto } from './dto/changePassword-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { CreateOtpDto } from 'src/otp/dto/create-otp.dto';
import { JWTAuthDto } from './dto/jwt-auth.dto';
import { VerifyOtpDto } from 'src/otp/dto/veify-otp.dto';

@Injectable()
export class AuthService extends BaseService {
  constructor(
    private readonly tokenService: TokenService,
    private readonly userService: UserService,
    private readonly otpService: OtpService,
  ) {
    super();
  }
  async register(verifyOtpDto: VerifyOtpDto, createUserDto: CreateUserDto) {
    await this.otpService.validation(verifyOtpDto);
    await this.userService.checkIsNotExist(verifyOtpDto.number);
    return this.userService.create(createUserDto);
  }

  async changePassword(changePasswordDto: ChangePasswordDto) {
    if (
      !changePasswordDto.password ||
      !changePasswordDto.otp ||
      !changePasswordDto.number
    ) {
      this.throwError();
    }
    await this.otpService.validation({
      code: changePasswordDto.otp,
      number: changePasswordDto.number,
    });
    return this.userService.changePassword(changePasswordDto);
  }

  async login(loginAuthDto: LoginAuthDto) {
    const user = await this.userService.findOneByNumber(loginAuthDto.number);
    console.table({
      'loginAuthDto.password': loginAuthDto.password,
      'user.password': user.password,
    });
    const isEqual = await this.comparePassowrd(
      loginAuthDto.password,
      user.password,
    );
    console.log("isEqual = ",isEqual)
    if (!isEqual) {
      this.throwError('پسورد اشتباه است', HttpStatus.BAD_REQUEST);
    }
    return await this.tokenService.create(user.id);
  }

  async getNewToken(jWTAuthDto: JWTAuthDto) {
    const payload = await this.tokenService.verifyRefreshToken(jWTAuthDto);
    const token = await this.tokenService.create(payload.id);
    return token;
  }

  update(id: number) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
