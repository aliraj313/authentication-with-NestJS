import { TokenService } from './token.service';
import { OtpModule } from './../otp/otp.module';
import { UserModule } from './../user/user.module';
import { Token, TokenSchema } from './entities/token.entity';
import { Global, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Token.name, schema: TokenSchema }]),
    UserModule,
    OtpModule,
   ],
  controllers: [AuthController],
  providers: [AuthService, TokenService,  ],
  exports: [AuthService],
})
export class AuthModule {}
