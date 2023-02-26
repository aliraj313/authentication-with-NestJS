import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateMessageDto } from './create-message.dto';
import { PaginationDto } from '../dto/pagination.dto';
import { Chat, ChatDocument } from '../entities/chat.entity';
import { Message, MessageDocument } from './message.entity';
import { FindMessagesDto } from './find-messages.dto';
import { UpdateMessageDto } from './update-message.dto';
import { RemoveMessageDto } from './remove-message.dto';
import { NotificationService } from '../notification/notification.service';
import { RemoveChatDto } from '../dto/remove-chat.dto';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
    @Inject(forwardRef(() => NotificationService))
    private readonly notificationService: NotificationService,
  ) {}

  async seenMessage(targetId: string, messageId: string) {
    return await this.messageModel.findOneAndUpdate(
      {
        target: targetId,
        _id: messageId,
      },
      { seen: true },
    );
  }

  create(createMessageDto: CreateMessageDto): MessageDocument {
    const message = new this.messageModel(createMessageDto);
    message.save();
    return message;
  }

  async findAll(
    findMessagesDto: FindMessagesDto,
    paginationDto: PaginationDto,
  ): Promise<MessageDocument[]> {
    const messages = await this.messageModel
      .find({
        $or: [
          {
            owner: { $eq: findMessagesDto.owner },
            target: { $eq: findMessagesDto.target },
          },
          {
            target: { $eq: findMessagesDto.owner },
            owner: { $eq: findMessagesDto.target },
          },
        ],
      })
      .limit(paginationDto.limit)
      .skip(paginationDto.skip);
    return messages;
  }

  async findOne(id: string): Promise<MessageDocument> {
    const message = await this.messageModel.findById(id);
    if (!message) {
      throw new HttpException('پیامی یافت نشد', HttpStatus.NOT_FOUND);
    }
    return message;
  }

  async update(
    id: string,
    updateMessageDto: UpdateMessageDto,
  ): Promise<MessageDocument> {
    const message = await this.messageModel.findByIdAndUpdate(
      id,
      updateMessageDto,
    );
    return message;
  }

  async remove(removeMessageDto: RemoveMessageDto): Promise<MessageDocument> {
    const message= await this.messageModel.findOneAndDelete({
      _id: removeMessageDto.messageId,
      owner: removeMessageDto.owner,
    });
    await this.notificationService.removeByMessageId(message)
    return message
  }

  async removeAll(removeChatDto:RemoveChatDto) {
    await this.messageModel.find({
      $or:[
        {
          owner:{$eq:removeChatDto.owner},
          target:{$eq:removeChatDto.target},
        },
        {
          target:{$eq:removeChatDto.owner},
          owner:{$eq:removeChatDto.target},
        }
      ]
    }).deleteMany()
  }
}
