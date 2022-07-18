import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BaseService {
  throwError(
    message: string = 'فیلد های ارسالی صحیح نیست',
    statusCode: HttpStatus = HttpStatus.BAD_REQUEST,
  ) {
    throw new HttpException({ message: message }, statusCode);
  }

  checkId(id: string) {
    if (id.length != 24) {
      this.throwError('آیدی ارسالی صحیح نیست', HttpStatus.BAD_REQUEST);
    }
  }
  checkCodeIsNumber(str) {
    const result = !isNaN(Number(str)) && !isNaN(parseFloat(str));
    if (!result) {
      this.throwError('کد نامعتبر است', HttpStatus.NOT_ACCEPTABLE);
    }
  }

  makeExpire(days: number): number {
    const daysMS = days * 86400000;
    const now = Date.now();
    return now + daysMS;
  }

  async hashPassowrd(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(password, salt);
    return hash;
  }
  async comparePassowrd(password: string, hash: string): Promise<Boolean> {
    const isMatch = await bcrypt.compare(password, hash);
    return isMatch;
  }

  responseSuccess(message: string) {
    return { message: message };
  }
}
