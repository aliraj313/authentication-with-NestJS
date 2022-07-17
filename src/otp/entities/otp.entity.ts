import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type OtpDocument = Otp & Document;

@Schema()
export class Otp {
  @Prop({required:true})
  code: number;

  @Prop({required:true})
  number: string;

  @Prop({default:OtpState.active})
  state: number;

  @Prop({required:true})
  expire: number;

}

export const OtpSchema = SchemaFactory.createForClass(Otp);

export const enum OtpState {
  active=1,
  verified=0,
  decative= -1
}