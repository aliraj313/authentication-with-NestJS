import { MessageService } from './messages/message.service';
import { RemoveChatDto } from './dto/remove-chat.dto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateChatDto } from './dto/create-chat.dto';
import { PaginationDto } from './dto/pagination.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { Chat, ChatDocument } from './entities/chat.entity';
import { MessageDocument } from './messages/message.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Chat.name) private chatModel: Model<ChatDocument>,
    private readonly messageService: MessageService,
  ) {}

  async setTargetChat(
    uid: string,
    createChatDto: CreateChatDto,
  ): Promise<ChatDocument> {
    const target = createChatDto.target;
    const owner = createChatDto.owner;
    createChatDto.target = owner;
    createChatDto.owner = target;
    return await this.setChat(uid, createChatDto);
  }

  async setChat(
    uid: string,
    createChatDto: CreateChatDto,
  ): Promise<ChatDocument> {
    const chat = await this.chatModel.findOne({
      owner: createChatDto.owner,
      target: createChatDto.target,
    });
    if (!chat) {
      createChatDto.unseen = uid == createChatDto.owner ? 0 : 1;
      return this.create(createChatDto);
    } else {
      const canIncrementUnseenChats = uid != createChatDto.owner;
      const unseen = canIncrementUnseenChats ? chat.unseen + 1 : chat.unseen;
      await this.update(chat.id, {
        msg: createChatDto.msg,
        unseen: unseen,
      });
      return chat;
    }
  }

  async decreaseUnseen(message: MessageDocument) {
    const query = {
      owner: message.target,
      target: message.owner,
    };
    const chat = await this.chatModel.findOne(query);
    const unseen = chat.unseen - 1 < 0 ? 0 : chat.unseen - 1;
    return await this.chatModel.findOneAndUpdate(query, { unseen: unseen });
  }
  private create(createChatDto: CreateChatDto): ChatDocument {
    const chat = new this.chatModel(createChatDto);
    chat.save();
    return chat;
  }

  async findAll(
    profileId: string,
    paginationDto: PaginationDto,
  ): Promise<ChatDocument[]> {
    const chats = await this.chatModel
      .find({ owner: profileId })
      .limit(paginationDto.limit)
      .skip(paginationDto.skip);
    return chats;
  }

  async findOne(id: string): Promise<Chat> {
    const chat = await this.chatModel.findById(id);
    if (!chat) {
      throw new HttpException('چتی یافت نشد', HttpStatus.NOT_FOUND);
    }
    return chat;
  }

  async update(id: string, updateChatDto: UpdateChatDto): Promise<Chat> {
    return await this.chatModel.findByIdAndUpdate(id, updateChatDto);
  }

  async remove(removeChatDto: RemoveChatDto) {
    const chats = await this.chatModel.find({
      $or: [
        {
          owner: { $eq: removeChatDto.owner },
          target: { $eq: removeChatDto.target },
        },
        {
          target: { $eq: removeChatDto.owner },
          owner: { $eq: removeChatDto.target },
        },
      ],
    });
    if (chats.length == 1) {
      await this.messageService.removeAll(removeChatDto);
    }
    return await this.chatModel.findOneAndDelete({
      owner: { $eq: removeChatDto.owner },
      target: { $eq: removeChatDto.target },
    });
  }
}
