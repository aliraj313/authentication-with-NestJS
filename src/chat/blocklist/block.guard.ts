import { ChatUserService } from '../chatUser/chatUser.service';
/*
https://docs.nestjs.com/guards#guards
*/

import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ChatTokenService } from '../token/chat-token.service';
import { BlocklistService } from './blockList.service';
import { WsException } from '@nestjs/websockets';
import { ChatEvents } from '../events/chat-events';

@Injectable()
export class BlockGuard implements CanActivate {
  constructor(
    private readonly blocklistService: BlocklistService,
    private readonly tokenService: ChatTokenService,
    private readonly chatUserService: ChatUserService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client = context.switchToWs().getClient();
    const data = context.switchToWs().getData();
    try {
      const ownerId = await this.tokenService.getUserIdFromPayload(client);
      const targetId = data.target;

      console.log('ownerId = ', ownerId);
      console.log('targetId = ', targetId);

      const owner = await this.chatUserService.findOneUserId(ownerId);
      const target = await this.chatUserService.findOneUserId(targetId);
      const isTargetBlockMe = await this.blocklistService.isTargetBlockedMe({
        owner: owner.id,
        target: target.id,
      });
      if (isTargetBlockMe) {
        client.emit(ChatEvents.Error, {
          result: 400,
          userId: targetId,
          msg: 'blocked error',
        });
        return false;
      }
      return true;
    } catch (error) {
      console.log('error called in block guard. err = ', error);
      client.emit(ChatEvents.Error, {
        result: 400,
        msg: error.response.message,
      });
      client.disconnect();
    }
  }
}
