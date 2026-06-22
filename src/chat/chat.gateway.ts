import { SubscribeMessage, WebSocketGateway,
   OnGatewayConnection, OnGatewayDisconnect, WebSocketServer, 
   ConnectedSocket,
   MessageBody} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { UsePipes, ValidationPipe } from '@nestjs/common';
import { ChatDto } from './dto/chat.dto';

@WebSocketGateway({
  cors: {
    origin: '*'
  },
})
export class ChatGateway 
  implements OnGatewayConnection, OnGatewayDisconnect{
    constructor(private readonly chatService: ChatService){}

  @WebSocketServer()
  server: Server
  handleConnection(socket: Socket){
    console.log("connected")
    console.log(socket.id)
  }

  handleDisconnect(socket: Socket) {
    console.log("disconnect")
    console.log(socket.id)
  }

//   @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
// @SubscribeMessage('sendMessage')
// async handleMessage(socket: Socket, payload: ChatDto) { 
//   try{ const newmsg = await this.chatService.saveMessage(payload);
//   console.log("message received from client:", payload);
//   console.log("message saved and sending to client")
//   this.server.emit("message received", newmsg);
 
// }catch(error){
//   console.error("error saving message")
// }
//   }

  @SubscribeMessage('JoinSession')
  async handleJoinSession(@ConnectedSocket() socket: Socket,
@MessageBody() payload: {userId: string}){
  socket.join(payload.userId)
  socket.emit('joinroomstatus', {status: 'success', message: `joined room ${payload.userId}`})
} 

  @SubscribeMessage('privateMessage')
  async handlePrivateMessage(@ConnectedSocket() client: Socket,
@MessageBody() payload: ChatDto){
  const savedMessage = await this.chatService.saveMessage(payload)
  console.log("message saved", payload)
  this.server.to(payload.receiver).emit('privateMessage', savedMessage)
  client.emit('privateMessage', savedMessage)
}

// @SubscribeMessage('groupMessage')
//   async handleGroupMessage(@ConnectedSocket() socket: Socket,
// @MessageBody() payload: {groupId: string}){
//   socket.join(payload.groupId)
//   this.server.to(payload.groupId).emit('groupMessage', save)
//   console.log(`group joined with Id ${payload.groupId}`);
// }

@SubscribeMessage('Markasread')
async handleMarkasRead(@ConnectedSocket() socket: Socket, 
@MessageBody() payload: {chatOwner: string, senderId: string}){
  await this.chatService.MarkasRead(payload.chatOwner, payload.senderId)
  this.server.to(payload.senderId).emit('Markasread' ,{readBy: payload.chatOwner})
}

@SubscribeMessage('MarkasDeliver')
async handleMarkasDeliver(@ConnectedSocket() socket: Socket,
@MessageBody() payload:{chatOwner: string, senderId: string}){
  await this.chatService.MarkasDelivered(payload.chatOwner, payload.senderId)
  this.server.to(payload.senderId).emit('chatDeliveredToReceiver', {deliverTo: payload.chatOwner})
}

@SubscribeMessage('Typing')
async handleTyping(@ConnectedSocket() socket: Socket,
@MessageBody() payload: {chatOwner: string, senderId: string}){
  this.server.to(payload.senderId).emit('userTyping',{userTyping: true, userId: payload.chatOwner} )
}

}

