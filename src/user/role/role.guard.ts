import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core/services/reflector.service';
import { TokenService } from 'src/auth/token.service';
import { RoleInfo } from '../entities/role.entity';
import { UserService } from '../user.service';
import { RoleService } from './role.service';
import { RolesKey } from './roles.decorator';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private roleService: RoleService,
    private tokenService: TokenService,
    private userService: UserService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const bearerToken = request.headers.authorization;
    console.log('roles guard is called');
    const payload = await this.tokenService.verifyAccessToken({
      authorization: bearerToken,
    });

    await this.userService.findOne(payload.id);
    const requireRules = this.reflector.getAllAndOverride<RoleInfo[]>(
      RolesKey,
      [context.getHandler(), context.getClass()],
    );
    const roles = await this.roleService.findAll(payload.id);
    const result = requireRules.some((role) => roles.includes(role));
    if (!result) {
      throw new HttpException(
        { message: 'شما چنین دسترسی ندارید' },
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
    return true;
  }
}
