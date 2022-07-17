import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseService } from 'src/base.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './entities/user.entity';

@Injectable()
export class UserService extends BaseService {
 async findOneByNumber(number: string) {
      const user = await this.userModel.findOne({number:number})
      if(!user){
        this.throwError("چنین کاربری پیدا نشد",HttpStatus.NOT_FOUND)
      }
      return user
    }
 
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {
    super();
  }

  async checkIsNotExist(number: string) {
    const user = await this.userModel.findOne({number:number})
    console.log("user ",user)
    if(user){
      this.throwError("این شماره تلفن قبلا ثبت شده است",HttpStatus.FOUND)
    }
 }
  async create(createUserDto: CreateUserDto) {
    if (!createUserDto.name ||!createUserDto.password || !createUserDto.number) {
      this.throwError();
    }
    const password = await this.hashPassowrd(createUserDto.password)
    createUserDto.password = password
    const user = await new this.userModel(createUserDto);
    user.save();
    return { user: user };
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
