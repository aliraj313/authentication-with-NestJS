import { Injectable } from '@nestjs/common';

@Injectable()
export class SmsService {
  sendOtpSms(code: number, number: string) {
    var message = `otp code : ${code}`
    this.sendSingleSms(message,number)
  }
  async sendSingleSms(message: string, tell: string) {
    console.log(`sended message = ${message} , tell = ${tell}`);
  }
}
