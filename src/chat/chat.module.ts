import { NotificationService } from './notification/notification.service';
import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { MongooseModule } from '@nestjs/mongoose';
import { Chat, ChatSchema } from './entities/chat.entity';
import { Message, MessageSchema } from './messages/message.entity';
import { ChatUser, ChatUserSchema } from './chatUser/chat-user.entity';
import { ChatTokenService } from './token/chat-token.service';
import { ChatUserService } from './chatUser/chatUser.service';
import { MessageService } from './messages/message.service';
import { BlockList, BlockListSchema } from './blocklist/blocklist.entity';
import { BlocklistService } from './blocklist/blockList.service';
import { NotificationSchema ,Notification} from './notification/notification.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Notification.name, schema: NotificationSchema }]),
    MongooseModule.forFeature([{ name: Chat.name, schema: ChatSchema }]),
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
    MongooseModule.forFeature([
      { name: ChatUser.name, schema: ChatUserSchema },
    ]),
    MongooseModule.forFeature([
      { name: BlockList.name, schema: BlockListSchema },
    ]),
  ],
  providers: [
    ChatGateway,
    ChatService,
    BlocklistService,
    ChatTokenService,
    MessageService,
    ChatTokenService,
    ChatUserService,
    NotificationService,
  ],
  exports: [ChatTokenService],
})
export class ChatModule {}
