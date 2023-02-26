import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types, Schema as MongooseSchema } from 'mongoose';
import * as timestamps from 'mongoose-timestamp';
import { ChatUser } from '../chatUser/chat-user.entity';
 
export type MessageDocument = HydratedDocument<Message>;
export enum FileType {
  file = 0,
  image = 1,
  video = 2,
  sound = 3,
}

@Schema()
export class Message {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'ChatUser' })
  owner: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: ChatUser.name })
  target: Types.ObjectId;

  @Prop({ default: false })
  seen: boolean;

  @Prop()
  msg: string; 

  @Prop()
  file: string; 
  
  @Prop()
  type: number;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
MessageSchema.plugin(timestamps);
