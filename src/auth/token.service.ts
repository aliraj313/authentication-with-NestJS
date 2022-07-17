import { Model } from 'mongoose';
import { Token, TokenDocument, TokenInfo } from './entities/token.entity';
import { BaseService } from 'src/base.service';
import * as jwt from 'jsonwebtoken';

import { Injectable } from '@nestjs/common';
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
    return latestToken;
  }
  async remove(jWTAuthDto: JWTAuthDto) {
    const token = await jwt.verify(jWTAuthDto.Authorization, TokenInfo.secret, {
      algorithms: [TokenInfo.algorithm],
    });
    console.log('payload = ', token);
  //  await this.tokenModel.findByIdAndRemove("");
    return token;
  }

  async findOne(uid: string) {
    const token = await this.tokenModel.findOne({ uid: uid });
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
