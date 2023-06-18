import { TokenService } from './token.service';
import { OtpModule } from './../otp/otp.module';
import { UserModule } from './../user/user.module';
import { Global, Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TokenConfig } from './config/token-config';

@Global()
@Module({
  imports: [forwardRef(() => UserModule), OtpModule],
  controllers: [AuthController],
  providers: [AuthService, TokenService, TokenConfig],
  exports: [AuthService, TokenService],
})
export class AuthModule {}
