import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RoleDocument = Role & Document;

@Schema()
export class Role {
  @Prop({required:true})
  uid: string;

  @Prop({required:true})
  role: string;
}

export const RoleSchema = SchemaFactory.createForClass(Role);


export const enum RoleInfo {
  User = 'user',
  Owner = 'owner',
  Admin = 'admin',
}