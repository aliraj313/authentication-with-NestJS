import { Module, forwardRef } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { AuthModule } from 'src/auth/auth.module';
import { RoleService } from 'src/user/role/role.service';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';
import { S3Service } from './s3.service';

@Module({
  imports: [AuthModule, UserModule],
  controllers: [UploadController],
  providers: [UploadService, S3Service],
})
export class UploadModule {}
