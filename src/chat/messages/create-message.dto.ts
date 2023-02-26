import { Types } from 'mongoose';

export class CreateMessageDto {
  owner: Types.ObjectId;

  target: Types.ObjectId;

  msg: string;

  file: string;

  type: number;
}
