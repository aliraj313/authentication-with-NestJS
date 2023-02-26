import { MessageService } from './messages/message.service';
import {
  forwardRef,
  Inject,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { ChatService } from './chat.service';
import { ChatUserService } from './chatUser/chatUser.service';
import { CreateChatUserDto } from './chatUser/create-chat-user.dto';
import { CreateChatDto } from './dto/create-chat.dto';
import { ChatDocument } from './entities/chat.entity';
import { ChatEvents } from './events/chat-events';
 import { ChatTokenService } from './token/chat-token.service';
import { CreateMessageDto } from './messages/create-message.dto';
import { IsTypingDto } from './dto/isTyping.dto';
import { PaginationDto } from './dto/pagination.dto';
import { BlockGuard } from './blocklist/block.guard';
import { BlocklistService } from './blocklist/blockList.service';
import { BlockListDto } from './blocklist/blocklist.dto';
import { NotificationService } from './notification/notification.service';
import { FindMessagesDto } from './messages/find-messages.dto';
import { SeenMessageDto } from './messages/seen-message.dto';
import { RemoveMessageDto } from './messages/remove-message.dto';
import { RemoveChatDto } from './dto/remove-chat.dto';
import { JWTAuthDto } from 'src/auth/dto/jwt-auth.dto';

@WebSocketGateway({ namespace: 'chat' })
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly chatService: ChatService,
    private readonly tokenService: ChatTokenService,
    private readonly chatUserService: ChatUserService,
    private readonly messageService: MessageService,
    private readonly blocklistService: BlocklistService,
    private readonly notificationService: NotificationService,
  ) {}

  @SubscribeMessage(ChatEvents.Join)
  async connectToServer(
    @ConnectedSocket() client,
    @MessageBody() createChatUserDto: CreateChatUserDto,
  ) {
    try {
      const userId = await this.tokenService.getUserIdFromPayload(client);
      createChatUserDto.userId = userId;
      const profile = await this.chatUserService.createIfNotExist(
        createChatUserDto,
        true,
      );
      client.join(profile.id);
      const chats = await this.chatService.findAll(profile.id, {
        limit: 10000,
        skip: 0,
      });
      this.sendAllConnectionState(chats, true);
      client.emit(
        ChatEvents.Connected,
        this.connectionStateJson(createChatUserDto.userId, true),
      );
      const notifications = await this.notificationService.findAll(profile.id);
      if (notifications.length > 0) {
        client.emit(ChatEvents.Notification, notifications);
      }
    } catch (error) {
      console.log('e = ', error);
      this.disconnect(client);
    }
  }

  @SubscribeMessage(ChatEvents.Disconnected)
  async disconnectUser(
    @ConnectedSocket() client,
    @MessageBody() createChatUserDto: CreateChatUserDto,
  ) {
    try {
      const userId = await this.tokenService.getUserIdFromPayload(client);
      createChatUserDto.userId = userId;
      const profile = await this.chatUserService.findOneUserId(
        createChatUserDto.userId,
      );
      await this.chatUserService.update(profile.id, { online: false });
      const chats = await this.chatService.findAll(profile.id, {
        limit: 10000,
        skip: 0,
      });
      this.sendAllConnectionState(chats, false);
      client.leave(createChatUserDto.userId);
      this.disconnect(client);
    } catch (error) {
      console.log('e = ', error);
      this.disconnect(client);
    }
  }

  sendAllConnectionState(chats: ChatDocument[], connected: boolean) {
    for (let index = 0; index < chats.length; index++) {
      const chat = chats[index];
      const targetId = chat.target.id.toString();
      console.log('chat target id = ', targetId);
      const json = this.connectionStateJson(targetId, connected);
      this.server.to(targetId).emit(ChatEvents.Connected, json);
    }
  }

  private connectionStateJson(userId: string, connectionState: boolean) {
    return { connected: connectionState, userId: userId };
  } 

  disconnect(client: Socket) {
    client.emit(ChatEvents.Error, new UnauthorizedException());
    client.disconnect();
  }

  @UseGuards(BlockGuard)
  @SubscribeMessage(ChatEvents.NewMessage)
  async sendNewMessage(
    @ConnectedSocket() client,
    @MessageBody() createChatDto: CreateChatDto,
    @MessageBody() createMessageDto: CreateMessageDto,
  ) {
    try {
      const userId = await this.tokenService.getUserIdFromPayload(client);
      const owner = await this.chatUserService.findOneUserId(userId);
      const target = await this.chatUserService.findOneUserId(
        createChatDto.target,
      );
      createChatDto.owner = owner.id;
      createChatDto.target = target.id;
      createMessageDto.owner = owner.id;
      createMessageDto.target = target.id;
      await this.chatService.setChat(owner.id, createChatDto);
      const message = await this.messageService.create(createMessageDto);
      await this.chatService.setTargetChat(owner.id, createChatDto);
      client.emit(ChatEvents.NewMessage, message);
      this.server.to(target.id).emit(ChatEvents.NewMessage, message);
      const notification = this.notificationService.create(
        {
          msg: createMessageDto.msg,
          target: target.id,
          messageId: message.id,
        },
        message.id,
        () => {
          sendAnotherUserSocket(
            this.server,
            message.target.toString(),
            ChatEvents.Notification,
            notification,
          );
        },
      );
    } catch (error) {
      this.disconnect(client);
    }
  }

  @SubscribeMessage(ChatEvents.SeenMessage)
  async seenMessage(
    @ConnectedSocket() client,
    @MessageBody() seenMessageDto: SeenMessageDto,
  ) {
    try {
      const userId = await this.tokenService.getUserIdFromPayload(client);
      seenMessageDto.userId = userId;
      const user = await this.chatUserService.findOneUserId(
        seenMessageDto.userId,
      );
      const message = await this.messageService.seenMessage(
        user.id,
        seenMessageDto.messageId,
      );
      console.log('message = ', message);
      await this.chatService.decreaseUnseen(message);
      this.server
        .to(message.owner.toString())
        .emit(ChatEvents.SeenMessage, { messageId: message.id, seen: true });
    } catch (error) {
      console.log('error = ', error);
    }
  }

  @SubscribeMessage(ChatEvents.IsTyping)
  async updateIsTyping(
    @ConnectedSocket() client,
    @MessageBody() isTypingDto: IsTypingDto,
  ) {
    try {
      const userId = await this.tokenService.getUserIdFromPayload(client);
      isTypingDto.owner = userId;
      const target = await this.chatUserService.findOneUserId(
        isTypingDto.target,
      );
      this.server.to(target.id).emit(ChatEvents.IsTyping, isTypingDto);
    } catch (error) {
      console.log('error = ', error);
      this.disconnect(client);
    }
  }

  @SubscribeMessage(ChatEvents.FindChats)
  async findMyChats(
    @ConnectedSocket() client,
    @MessageBody() paginationDto: PaginationDto,
  ) {
    try {
      const userId = await this.tokenService.getUserIdFromPayload(client);
      const me = await this.chatUserService.findOneUserId(userId);
      const chats = await this.chatService.findAll(me.id, paginationDto);
      client.emit(ChatEvents.FindChats, chats);
    } catch (error) {
      console.log('error = ', error);
      this.disconnect(client);
    }
  }

  @UseGuards(BlockGuard)
  @SubscribeMessage(ChatEvents.FindMessages)
  async findMessages(
    @ConnectedSocket() client,
    @MessageBody() findMessagesDto: FindMessagesDto,
    @MessageBody() paginationDto: PaginationDto,
  ) {
    try {
      const userId = await this.tokenService.getUserIdFromPayload(client);
      const owner = await this.chatUserService.findOneUserId(userId);
      const target = await this.chatUserService.findOneUserId(
        findMessagesDto.target,
      );
      findMessagesDto.owner = owner.id;
      findMessagesDto.target = target.id;
      const messages = await this.messageService.findAll(
        findMessagesDto,
        paginationDto,
      );
      client.emit(ChatEvents.FindChats, messages);
    } catch (error) {
      console.log('error = ', error);
      this.disconnect(client);
    }
  }

  @SubscribeMessage(ChatEvents.RemoveMessage)
  async removeMessage(
    @ConnectedSocket() client,
    @MessageBody() removeMessageDto: RemoveMessageDto,
  ) {
    try {
      const userId = await this.tokenService.getUserIdFromPayload(client);
      const owner = await this.chatUserService.findOneUserId(userId);
      removeMessageDto.owner = owner.id;
      const message = await this.messageService.remove(removeMessageDto);
      if (message) {
        console.log('removed message = ', message);
        client.emit(ChatEvents.RemoveMessage, message);
        sendAnotherUserSocket(
          this.server,
          message.target.toString(),
          ChatEvents.RemoveMessage,
          message,
        );
      }
    } catch (error) {
      console.log('error = ', error);
      this.disconnect(client);
    }
  }

  @SubscribeMessage(ChatEvents.RemoveChat)
  async removeChat(
    @ConnectedSocket() client,
    @MessageBody('chatId') chatId: string,
  ) {
    try {
      const userId = await this.tokenService.getUserIdFromPayload(client);
      const owner = await this.chatUserService.findOneUserId(userId);
      const chat = await this.chatService.findOne(chatId);
      const removedChat = await this.chatService.remove({
        owner: owner.id,
        target: chat.target.toString(),
      });
      client.emit(ChatEvents.RemoveChat,removedChat)
    } catch (error) {
      console.log('error = ', error);
      this.disconnect(client);
    }
  }

  @UseGuards(BlockGuard)
  @SubscribeMessage(ChatEvents.FindUser)
  async findUser(
    @ConnectedSocket() client,
    @MessageBody('userId') userId: string,
  ) {
    try {
      const target = await this.chatUserService.findOneUserId(userId);
      client.emit(ChatEvents.FindChats, target);
    } catch (error) {
      console.log('error = ', error);
      this.disconnect(client);
    }
  }

  @SubscribeMessage(ChatEvents.BlockUser)
  async blockUser(
    @ConnectedSocket() client,
    @MessageBody() blockListDto: BlockListDto,
  ) {
    try {
      const userId = await this.tokenService.getUserIdFromPayload(client);
      const owner = await this.chatUserService.findOneUserId(userId);
      const target = await this.chatUserService.findOneUserId(
        blockListDto.target,
      );
      blockListDto.owner = owner.id;
      blockListDto.target = target.id;
      if (blockListDto.owner != blockListDto.target) {
        await this.blocklistService.blockUser(blockListDto);
        client.emit(ChatEvents.BlockUser, { result: true });
      } else {
        client.emit(ChatEvents.BlockUser, { result: false });
      }
    } catch (error) {
      this.disconnect(client);
    }
  }

  @SubscribeMessage(ChatEvents.UnblockUser)
  async unblockUser(
    @ConnectedSocket() client,
    @MessageBody() blockListDto: BlockListDto,
  ) {
    try {
      const userId = await this.tokenService.getUserIdFromPayload(client);
      const owner = await this.chatUserService.findOneUserId(userId);
      const target = await this.chatUserService.findOneUserId(
        blockListDto.target,
      );
      blockListDto.owner = owner.id;
      blockListDto.target = target.id;
      if (blockListDto.owner != blockListDto.target) {
        await this.blocklistService.unBlockUser(blockListDto);
        client.emit(ChatEvents.UnblockUser, { result: true });
      }
    } catch (error) {
      this.disconnect(client);
    }
  }

  @SubscribeMessage(ChatEvents.ClearNotifications)
  async clearNotifications(@ConnectedSocket() client) {
    try {
      const userId = await this.tokenService.getUserIdFromPayload(client);
      const owner = await this.chatUserService.findOneUserId(userId);
      await this.notificationService.removeAll(owner.id);
    } catch (error) {
      this.disconnect(client);
    }
  }
}

function sendAnotherUserSocket(
  server: Server,
  roomId: string,
  event: string,
  data,
) {
  server.to(roomId).emit(event, data);
}
