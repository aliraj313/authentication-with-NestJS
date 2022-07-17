 
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TokenDocument = Token & Document;

@Schema()
export class Token {
  @Prop({required:true})
  accessToken: string;

  @Prop({required:true})
  uid: string;
}

export const TokenSchema = SchemaFactory.createForClass(Token);


export enum TokenInfo {
    expire = "1h",
    algorithm = "HS512",
    secret = "$Z=C5!2Ej}++:L/lcH2st[.50C(T!EeTOgAj.7(Szy_EP#fh&yepVck}7sb70kk"
}