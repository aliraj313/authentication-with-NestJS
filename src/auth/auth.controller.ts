import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Headers,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { JWTAuthDto } from './dto/jwt-auth.dto';
import { ChangePasswordDto } from './dto/changePassword-auth.dto';
import { CreateOtpDto } from 'src/otp/dto/create-otp.dto';
import { AuthGuard } from './guards/auth.guard';
import { RefreshTokenGuard } from './guards/refreshToken.guard';
import { VerifyOtpDto } from 'src/otp/dto/veify-otp.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(
    @Body() verifyOtpDto: VerifyOtpDto,
    @Body() createUserDto: CreateUserDto,
  ) {
    return this.authService.register(verifyOtpDto, createUserDto);
  }

  @Post('login')
  login(@Body() loginAuthDto: LoginAuthDto) {
    return this.authService.login(loginAuthDto);
  }

  @UseGuards(RefreshTokenGuard)
  @Get('token/new')
  validateToken(@Headers() jWTAuthDto: JWTAuthDto) {
    return this.authService.getNewToken(jWTAuthDto);
  }

  @Post('password/change')
  changePassword(@Body() changePasswordDto: ChangePasswordDto) {
    return this.authService.changePassword(changePasswordDto);
  }
}
