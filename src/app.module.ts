import { SmsService } from './otp/sms.service';
import { BaseService } from './base.service';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { OtpModule } from './otp/otp.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_DB_URL_CONNECTION),
    OtpModule,
  ],
  controllers: [AppController],
  providers: [ SmsService, BaseService, AppService],
})
export class AppModule {}
