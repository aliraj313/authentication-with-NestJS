import { SetMetadata } from '@nestjs/common';
import { RoleInfo } from '../entities/role.entity';
export const RolesKey="roles"
export const Roles = (...args: RoleInfo[]) => SetMetadata(RolesKey, args);