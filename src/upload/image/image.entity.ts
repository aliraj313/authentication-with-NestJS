import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as timestamps from 'mongoose-timestamp';

export type ImageDocument = Image & Document;

@Schema()
export class Image {
  @Prop({ required: true })
  key: string;
}

export const ImageSchema = SchemaFactory.createForClass(Image);
ImageSchema.plugin(timestamps);