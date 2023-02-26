import { Injectable } from '@nestjs/common';
import { TokenService } from 'src/auth/token.service';

@Injectable()
export class ChatTokenService {
  constructor(private readonly tokenService: TokenService) {}

  async getUserIdFromPayload(client) {
    const token = client.handshake.headers.authorization;
    const payload = await this.tokenService.verifyToken({
      authorization: token,
    });
    return payload.id;
  }
}
