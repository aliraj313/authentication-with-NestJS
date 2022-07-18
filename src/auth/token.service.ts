import { Model } from 'mongoose';
import { Token, TokenDocument, TokenInfo } from './entities/token.entity';
import { BaseService } from 'src/base.service';
import * as jwt from 'jsonwebtoken';

import { ConsoleLogger, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { JWTAuthDto } from './dto/jwt-auth.dto';

@Injectable()
export class TokenService extends BaseService {
  constructor(
    @InjectModel(Token.name) private tokenModel: Model<TokenDocument>,
  ) {
    super();
  }
  async create(uid: string) {
    const payload = { id: uid };
    const token = jwt.sign(payload, TokenInfo.secret, {
      expiresIn: TokenInfo.expire,
      algorithm: TokenInfo.algorithm,
    });
    var latestToken = await this.findOne(uid);

    if (latestToken) {
      this.updateOne(uid, token);
      latestToken.accessToken = token;
    } else {
      const item = new this.tokenModel({ uid: uid, accessToken: token });
      item.save();
      return this.getItem(item);
    }
    return this.getItem(latestToken);
  }

  async remove(jWTAuthDto: JWTAuthDto) {
    console.log('Authorization = ', jWTAuthDto.authorization);
    const payload = await this.verifyToken(jWTAuthDto);
    await this.tokenModel.findOneAndRemove({ uid: payload.id });
    return this.responseSuccess('خروج موفقیت آمیز بود');
  }
  async verifyToken(jWTAuthDto: JWTAuthDto) {
    try {
      const token = jWTAuthDto.authorization.split(' ')[1];
      const payload = await jwt.verify(token, TokenInfo.secret, {
        algorithms: [TokenInfo.algorithm],
      });
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

  async findOne(uid: string) {
    const token = await this.tokenModel.findOne({ uid: uid });
    
    return token;
  }
  async findOneToken(accessToken: string) {
    const token = await this.tokenModel.findOne({ accessToken: accessToken });
    if(!token){
      this.throwError('چنین توکنی معتبر نیست', HttpStatus.NOT_FOUND)
    }
    return token;
  }
  async updateOne(uid: string, token: string) {
    const newToken = await this.tokenModel.findOneAndUpdate(
      { uid: uid },
      { accessToken: token },
    );
    return newToken;
  }

  getItem(item) {
    return {
      accessToken: item.accessToken,
      userId: item.uid,
    };
  }
}
