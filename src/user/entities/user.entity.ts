import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({required:true})
  name: string;

  @Prop({required:true})
  number: string;

  @Prop({required:true})
  password: string;
  
}

export const UserSchema = SchemaFactory.createForClass(User);

/*

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({required:true})
  name: string;

  @Prop({required:true})
  number: number;
}

export const UserSchema = SchemaFactory.createForClass(User);



*/