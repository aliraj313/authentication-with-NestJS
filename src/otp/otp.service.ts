import { SmsService } from './sms.service';
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseService } from 'src/base.service';
import { CreateOtpDto } from './dto/create-otp.dto';
import { UpdateOtpDto } from './dto/update-otp.dto';
import { Otp, OtpDocument, OtpState } from './entities/otp.entity';

@Injectable()
export class OtpService extends BaseService {
  constructor(
    @InjectModel(Otp.name) private otpModel: Model<OtpDocument>,
    private readonly smsService: SmsService,
  ) {
    super();
  }
  async generate(createOtpDto: CreateOtpDto) {
    if (!createOtpDto.number) {
      this.throwError();
    }
    const expire = makeExpireTime(5);
    const code = generate6DigitsOtpCode();
   const otp= new this.otpModel({
      code: code,
      expire: expire,
      number: createOtpDto.number,
    });
    otp.save()
    this.smsService.sendOtpSms(code,createOtpDto.number)
    return this.responseSuccess("کد 6رقمی باموفقیت ارسال شد")
  }

  async verify(createOtpDto: CreateOtpDto) {
    if(!createOtpDto.code || !createOtpDto.number){
      this.throwError()
    }

    const otp = await this.findOne(createOtpDto);
    this.checkExpire(otp.expire);
    if (otp.state != OtpState.active) {
      this.throwError('کد تایید نشده است', HttpStatus.NOT_ACCEPTABLE);
    }
    await this.otpModel.findByIdAndUpdate(otp.id,{state:OtpState.verified})
    return this.responseSuccess('کد تایید شد'); 
  }

  async validation(createOtpDto: CreateOtpDto) {
    if(!createOtpDto.code){
      this.throwError()
    }
    const otp = await this.findOne(createOtpDto);
    this.checkExpire(otp.expire);
    if (otp.state != OtpState.verified) {
      this.throwError('کد تایید نشده است', HttpStatus.NOT_ACCEPTABLE);
    }
    this.remove(otp.id)
    return this.responseSuccess('کد مورد تایید می باشد');
  }
  

  async findOne(createOtpDto: CreateOtpDto) {
    const otp = await this.otpModel.findOne({
      number: createOtpDto.number,
      code: createOtpDto.code,
    });
    console.log('otp ', otp);
    if (!otp) {
      this.throwError(
        'همچین کدی برای این شماره تلفن وجود ندارد',
        HttpStatus.NOT_FOUND,
      );
    }
    return otp;
  }

  async update(id: number, updateOtpDto: UpdateOtpDto) {
    return `This action updates a #${id} otp`;
  }

  async remove(id: number) {
    await this.otpModel.findByIdAndRemove(id)
  }
  checkExpire(expire: number) {
    const now = Number(new Date());
    if (now > expire) {
      this.throwError('کد منقضی شده است', HttpStatus.NOT_ACCEPTABLE);
    }
  }
}
function generate6DigitsOtpCode() {
  return Math.floor(Math.random() * 999999);
}

function makeExpireTime(minute: number) {
  const now = Date.now();
  const minuteToMS = 1000 * 60 * minute;
  const expire = now + minuteToMS;
  return expire;
}
