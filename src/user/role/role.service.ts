import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BaseService } from 'src/base.service';
import { Role, RoleDocument, RoleInfo } from '../entities/role.entity';
import { Model } from 'mongoose';

@Injectable()
export class RoleService extends BaseService {
  create(role: RoleInfo,uid:string) {
   const newRole =new this.roleModel({role:role,uid:uid})
   newRole.save()
  }
  constructor(@InjectModel(Role.name) private roleModel: Model<RoleDocument>) {
    super();
  }

  async findAll(uid: string){
    const roles = await this.roleModel.find({ uid: uid });
    var list=[]
    roles.forEach((item)=>list.push(item.role))
    return list
  }
}
