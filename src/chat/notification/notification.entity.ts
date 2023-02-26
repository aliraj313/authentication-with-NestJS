import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types, Schema as MongooseSchema } from 'mongoose';
import * as timestamps from 'mongoose-timestamp';

export type NotificationDocument = HydratedDocument<Notification>;

@Schema()
export class Notification {
  @Prop()
  msg: string;

  @Prop()
  target: Types.ObjectId;

  @Prop()
  messageId: Types.ObjectId;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
NotificationSchema.plugin(timestamps);