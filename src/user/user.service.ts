import { ChangePasswordDto } from './../auth/dto/changePassword-auth.dto';
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseService } from 'src/base.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './entities/user.entity';
import { RoleService } from './role/role.service';
import { RoleInfo } from './entities/role.entity';

@Injectable()
export class UserService extends BaseService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly roleService: RoleService,
  ) {
    super();
  }

  async checkIsNotExist(number: string) {
    const user = await this.userModel.findOne({ number: number });
    console.log('user ', user);
    if (user) {
      this.throwError('این شماره تلفن قبلا ثبت شده است', HttpStatus.FOUND);
    }
  }
  async create(createUserDto: CreateUserDto) {
    if (
      !createUserDto.name ||
      !createUserDto.password ||
      !createUserDto.number
    ) {
      this.throwError();
    }

    const password = await this.hashPassowrd(createUserDto.password);
    createUserDto.password = password;
    const user = await new this.userModel(createUserDto);
    const isFirst = await this.isFirstUser();
    if (isFirst) {
      this.roleService.create(RoleInfo.Owner,user.id)
    }
    user.save();
    return { user: user };
  }

  async isFirstUser() {
    const users = await this.userModel.find().limit(1);
    return users.length == 0;
  }

  findAll() {
    return `This action returns all user`;
  }
  async changePassword(changePasswordDto: ChangePasswordDto) {
    const user = await this.findOneByNumber(changePasswordDto.number);
    const newHashingPassword = await this.hashPassowrd(
      changePasswordDto.password,
    );
    await this.userModel.findByIdAndUpdate(user.id, {
      password: newHashingPassword,
    });
    return this.responseSuccess('رمز عبور باموفقیت عوض شد');
  }
  async findOneByNumber(number: string) {
    const user = await this.userModel.findOne({ number: number });
    if (!user) {
      this.throwError('چنین کاربری پیدا نشد', HttpStatus.NOT_FOUND);
    }
    return user;
  }
  async findOne(uid: string) {
    const user = await this.userModel.findOne({ _id: uid });
    if (!user) {
      this.throwError('چنین کاربری یافت نشد', HttpStatus.NOT_FOUND);
    }
    return this.getInfo(user);
  }

  getInfo(Item) {
    return {
      id: Item._id,
      name: Item.name,
      number: Item.number,
    };
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
