import { MessageService } from '../messages/message.service';
import { CreateNotificationDto } from './create-notification.dto';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification, NotificationDocument } from './notification.entity';
import { MessageDocument } from '../messages/message.entity';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notification.name)
    private notificationModel: Model<NotificationDocument>,
    private readonly messageService: MessageService,
  ) {}

  create(
    createNotificationDto: CreateNotificationDto,
    messageId: string,
    callback: Function,
  ): NotificationDocument {
    const notification = new this.notificationModel(createNotificationDto);
    notification.save();
    setTimeout(async () => {
      const message = await this.messageService.findOne(messageId);
      if (message) {
        if (!message.seen) {
          await callback();
        }
      }
    }, 10000);
    return notification;
  }

  async findAll(target: string) {
    return await this.notificationModel.find({ target: target });
  }

  async removeAll(target: string) {
    await this.notificationModel.find({ target: target }).deleteMany();
  }

  async removeByMessageId(message: MessageDocument) {
    await this.notificationModel.findOneAndDelete({ messageId: message.id });
  }
}
