import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { TokenService } from './token.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly tokenService: TokenService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const bearerToken = request.headers.authorization;
    await this.tokenService.verifyToken({
      authorization: bearerToken,
    });
    await this.tokenService.findOneToken(bearerToken.split('Bearer ')[1]);
    return true;
  }
}
