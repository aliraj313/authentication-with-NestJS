import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { OtpService } from './otp.service';
import { OtpController } from './otp.controller';
import { Otp, OtpSchema } from './entities/otp.entity';
import { SmsService } from './sms.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Otp.name, schema: OtpSchema }])],
  controllers: [OtpController],
  providers: [OtpService,SmsService],
  exports: [OtpService],
})
export class OtpModule {}
