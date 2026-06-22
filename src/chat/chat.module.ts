import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { Mongoose } from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { Chat, ChatSchema } from './scheme/chat.schema';

@Module({
    imports:[MongooseModule.forFeature([{name: 'Chat', schema: ChatSchema}])],
    
    providers:[ChatService, ChatGateway],
    exports:[MongooseModule, ChatService],
})


export class ChatModule {}
    
