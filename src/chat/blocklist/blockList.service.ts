import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BlockList } from 'net';
import { BlockListDto } from './blocklist.dto';
import { BlockListDocument } from './blocklist.entity';

@Injectable()
export class BlocklistService {
  constructor(
    @InjectModel(BlockList.name)
    private blockListModel: Model<BlockListDocument>,
  ) {}

  async blockUser(blockListDto: BlockListDto) {
    const blocksBefore = await this.isTargetBlockedMe(blockListDto);
    if (!blocksBefore) {
      this.create(blockListDto);
    }
  }
  async unBlockUser(blockListDto: BlockListDto) {
    const blocksBefore = await this.isTargetBlockedMe(blockListDto);
    if (blocksBefore) {
      await this.deleteOne(blockListDto);
    }
  }

  async isTargetBlockedMe(blockListDto: BlockListDto): Promise<boolean> {
    const block = await this.findOne(blockListDto);
    return block != undefined;
  }

  private create(blockListDto: BlockListDto) {
    new this.blockListModel(blockListDto).save();
  }

  private async findOne(
    blockListDto: BlockListDto,
  ): Promise<BlockListDocument> {
    const block = await this.blockListModel.findOne({
      $or: [
        {
          owner: { $eq: blockListDto.owner },
          target: { $eq: blockListDto.target },
        },
        {
          target: { $eq: blockListDto.owner },
          owner: { $eq: blockListDto.target },
        },
      ],
    });
    return block;
  }

  private async deleteOne(blockListDto: BlockListDto) {
    await this.blockListModel.findOneAndDelete(blockListDto);
  }
}
