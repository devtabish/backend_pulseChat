import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { Chat, ChatDocument } from './scheme/chat.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ChatDto } from './dto/chat.dto';
import { Types } from 'mongoose';

@Injectable()
export class ChatService {
    constructor(@InjectModel(Chat.name) private messageModel: Model<ChatDocument>){}

    async saveMessage(body: ChatDto){
        if(!body.content){
            throw new ConflictException("Message cannot be empty")
        }

        const createdMessage = new this.messageModel({sender: body.sender,
            receiver: body.receiver, content: body.content
        })
        return await createdMessage.save();
    }

    async getOfflineMessages(userId: string): Promise<Chat[]>{
        return await this.messageModel.find({receiverId: userId, status: 'sent'})
    }

    async MarkasDelivered(chatOwner: string, senderId: string): Promise<void>{
        await this.messageModel.updateMany({
            receiver: new Types.ObjectId(chatOwner), sender: new Types.ObjectId(senderId), status: 'sent'
        },
    { $set: {status: 'delivered'}}).exec()
    }
    async MarkasRead(chatOwner: string, senderId: string): Promise<void>{
        const result = await this.messageModel.updateMany({receiver: new Types.ObjectId(chatOwner), sender: new Types.ObjectId(senderId), status: {$ne: 'read'}},
        {$set: {status: 'read'}
    },).exec()
    console.log("read db update results", result)
    }

}
