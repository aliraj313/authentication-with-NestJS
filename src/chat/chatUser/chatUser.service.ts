import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateChatUserDto } from './create-chat-user.dto';
import { UpdateChatUserDto } from '../chatUser/update-chat-user.dto';
import { ChatUser, ChatUserDocument } from './chat-user.entity';

@Injectable()
export class ChatUserService {
  constructor(
    @InjectModel(ChatUser.name) private chatUserModel: Model<ChatUserDocument>,
  ) {}

  async createIfNotExist(
    createChatUserDto: CreateChatUserDto,
    isOnline: boolean = false,
  ): Promise<ChatUserDocument> {
    const profile = await this.chatUserModel.findOne({
      userId: createChatUserDto.userId,
    });
    if (profile) {
      await this.chatUserModel.findByIdAndUpdate(profile.id, {
        online: isOnline,
      });
      return profile;
    } else {
      return this.create(createChatUserDto);
    }
  }

  private create(createChatUserDto: CreateChatUserDto) {
    const profile = new this.chatUserModel(createChatUserDto);
    profile.save();
    return profile;
  }

  findAll() {}

  async findOneUserId(id: string): Promise<ChatUserDocument> {
    const chatUser = await this.chatUserModel.findOne({ userId: id });
    if (!chatUser) {
      throw new HttpException('کاربری یافت نشد', HttpStatus.NOT_FOUND);
    }
    return chatUser;
  }
  async findOne(id: string): Promise<ChatUserDocument> {
    console.log('id = ', id);
    const chatUser = await this.chatUserModel.findById(id);
    console.log('chatUser = ', chatUser);
    if (!chatUser) {
      throw new HttpException('کاربری یافت نشد', HttpStatus.NOT_FOUND);
    }
    return chatUser;
  }

  async update(
    id: string,
    updateChatUserDto: UpdateChatUserDto,
  ): Promise<ChatUser> {
    const chatUser = await this.chatUserModel.findByIdAndUpdate(
      id,
      updateChatUserDto,
    );
    return chatUser;
  }
}
