import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Schema as MongooseSchema, HydratedDocument } from 'mongoose';
import * as timestamps from 'mongoose-timestamp';
import { ChatUser } from '../chatUser/chat-user.entity';

export type BlockListDocument = HydratedDocument<BlockList>;

@Schema()
export class BlockList {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: ChatUser.name })
  owner: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: ChatUser.name })
  target: Types.ObjectId;
}

export const BlockListSchema = SchemaFactory.createForClass(BlockList);
BlockListSchema.plugin(timestamps);
