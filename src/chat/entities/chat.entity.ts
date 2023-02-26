import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Schema as MongooseSchema, HydratedDocument } from 'mongoose';
import { ChatUser } from '../chatUser/chat-user.entity';
import * as timestamps from 'mongoose-timestamp';

export type ChatDocument = HydratedDocument<Chat>;

@Schema()
export class Chat {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: ChatUser.name })
  owner: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: ChatUser.name })
  target: Types.ObjectId;

  @Prop()
  name: string;

  @Prop()
  msg: string;

  @Prop({ default: 1 })
  unseen: number;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
ChatSchema.plugin(timestamps);
