import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Mongoose,Schema as MongooseSchema, Types} from "mongoose";
import { Document } from "mongoose";



export type ChatDocument = HydratedDocument<Chat>
@Schema({timestamps: true})
export class Chat extends Document{
    
@Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
sender: Types.ObjectId; 

@Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
receiver: Types.ObjectId; 

@Prop({ required: true })
content: string; 

@Prop({default: 'sent', enum: ['sent', 'delivered', 'read', 'typing']})
    status: string;
    
}
export const ChatSchema = SchemaFactory.createForClass(Chat)

