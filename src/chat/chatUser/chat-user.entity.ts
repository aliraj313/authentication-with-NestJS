import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types, Schema as MongooseSchema } from 'mongoose';
import * as timestamps from 'mongoose-timestamp';

export type ChatUserDocument =  HydratedDocument<ChatUser>;

@Schema()
export class ChatUser {
  @Prop()
  name: string;

  @Prop()
  userId: string;

  @Prop({ default: true })
  online: boolean;

  @Prop()
  avatar: string;
}

export const ChatUserSchema = SchemaFactory.createForClass(ChatUser);
ChatUserSchema.plugin(timestamps);
