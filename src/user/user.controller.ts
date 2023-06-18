import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard)
  @Get('me')
  testAll() {
    return { message: 'hello user' };
  }

  // @UseGuards(AuthGuard,RoleGuard)
  // @Get("test/owner")
  // @Roles(RoleInfo.Owner)
  // testForOwner() {
  //   return {message :"hello owner"}
  // }

  /*
  @Post()
  create(@Body()createOtpDto: CreateOtpDto,@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createOtpDto,createUserDto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
  */
}
