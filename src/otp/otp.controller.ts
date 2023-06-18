import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { OtpService } from './otp.service';
import { CreateOtpDto } from './dto/create-otp.dto';
import { VerifyOtpDto } from './dto/veify-otp.dto';
 
@Controller('otp')
export class OtpController {
  constructor(private readonly otpService: OtpService) {}

  @Post("generate")
  generate(@Body() createOtpDto: CreateOtpDto) {
    return this.otpService.generate(createOtpDto);
  }

  @Put("verify")
  verify(@Body() verifyOtpDto: VerifyOtpDto) {
    return this.otpService.verify(verifyOtpDto);
  }

  // @Post("validation")
  // validation(@Body() createOtpDto: CreateOtpDto) {
  //   return this.otpService.validation(createOtpDto);
  // }

}
