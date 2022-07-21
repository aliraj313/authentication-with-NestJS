import { Module ,forwardRef} from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './entities/user.entity';
import { Role, RoleSchema } from './entities/role.entity';
import { RoleService } from './role/role.service';
import {  AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Role.name, schema: RoleSchema }]),
    forwardRef(() => AuthModule)
  ],
  controllers: [UserController],
  providers: [UserService, RoleService],
  exports: [UserService,RoleService],
})
export class UserModule {}
