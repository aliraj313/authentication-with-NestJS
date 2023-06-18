import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { TokenService } from '../token.service';
 
@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(private readonly tokenService: TokenService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    console.log('RefreshTokenGuard is called');
    const bearerToken = request.headers.authorization;
    await this.tokenService.verifyRefreshToken({
      authorization: bearerToken,
    });
    return true;
  }
  
}
