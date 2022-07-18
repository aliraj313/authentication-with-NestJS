import { TokenService } from './token.service';
import { OtpService } from './../otp/otp.service';
import { UserService } from './../user/user.service';
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseService } from 'src/base.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { ChangePasswordDto } from './dto/changePassword-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { Token, TokenDocument } from './entities/token.entity';
import { CreateOtpDto } from 'src/otp/dto/create-otp.dto';
import { JWTAuthDto } from './dto/jwt-auth.dto';

@Injectable()
export class AuthService extends BaseService {
  constructor(
    private readonly tokenService: TokenService,
    private readonly userService: UserService,
    private readonly otpService: OtpService,
  ) {
    super();
  }
  async register(createOtpDto: CreateOtpDto, createUserDto: CreateUserDto) {
    if (!createOtpDto.code || !createOtpDto.number || !createUserDto.name) {
      this.throwError();
    }
    await this.otpService.validation(createOtpDto);
    await this.userService.checkIsNotExist(createOtpDto.number);
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
    if (!loginAuthDto.number || !loginAuthDto.password) {
      this.throwError();
    }
    const user = await this.userService.findOneByNumber(loginAuthDto.number);
    console.table({
      'loginAuthDto.password': loginAuthDto.password,
      'user.password': user.password,
    });
    const isEqual = await this.comparePassowrd(
      loginAuthDto.password,
      user.password,
    );
    if (!isEqual) {
      this.throwError('پسورد اشتباه است', HttpStatus.BAD_REQUEST);
    }
    return await this.tokenService.create(user.id);
  }

  async logout(jWTAuthDto: JWTAuthDto) {
    return this.tokenService.remove(jWTAuthDto);
  }

  async getNewToken(jWTAuthDto: JWTAuthDto) {
    const payload = await this.tokenService.verifyToken(jWTAuthDto);
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
