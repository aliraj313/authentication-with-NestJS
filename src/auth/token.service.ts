import { BaseService } from 'src/base.service';
import * as jwt from 'jsonwebtoken';

import { HttpStatus, Injectable } from '@nestjs/common';
import { JWTAuthDto } from './dto/jwt-auth.dto';
import { TokenConfig } from './config/token-config';

@Injectable()
export class TokenService extends BaseService {
  accessTokenSecret: string = process.env.JWT_ACCESS_TOKEN;
  refreshTokenSecret: string = process.env.JWT_REFRESH_TOKEN;
  constructor(private readonly tokenConfig: TokenConfig) {
    super();
  }

  async create(uid: string) {
    const payload = { id: uid };
    console.log('create called');

    const accessToken = jwt.sign(payload, this.tokenConfig.accessTokenSecret, {
      expiresIn: this.tokenConfig.accessTokenExpire,
      algorithm: this.tokenConfig.accessTokenAlgorithm,
    });
    const refreshToken = jwt.sign(
      payload,
      this.tokenConfig.refreshTokenSecret,
      {
        expiresIn: this.tokenConfig.refreshTokenExpire,
        algorithm: this.tokenConfig.refreshTokenAlgorithm,
      },
    );

    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }

  async verifyAccessToken(jWTAuthDto: JWTAuthDto) {
    try {
      const token = jWTAuthDto.authorization.split('Bearer ')[1];
      const payload = await jwt.verify(
        token,
        this.tokenConfig.accessTokenSecret,
        {
          algorithms: [this.tokenConfig.accessTokenAlgorithm],
        },
      );
      console.log(
        'payload called in verifyToken in token.service.ts , payload = ',
        payload,
      );
      const item = { id: payload['id'] };
      return item;
    } catch {
      this.throwError('توکن نامعتبر است', HttpStatus.UNAUTHORIZED);
    }
  }

  async verifyRefreshToken(jWTAuthDto: JWTAuthDto) {
    try {
      const token = jWTAuthDto.authorization.split('Bearer ')[1];
      const payload = await jwt.verify(
        token,
        this.tokenConfig.refreshTokenSecret,
        {
          algorithms: [this.tokenConfig.refreshTokenAlgorithm],
        },
      );
      console.log(
        'payload called in verifyToken in token.service.ts , payload = ',
        payload,
      );
      const item = { id: payload['id'] };
      return item;
    } catch {
      this.throwError('توکن نامعتبر است', HttpStatus.UNAUTHORIZED);
    }
  }
}
