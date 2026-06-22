import { IsString } from "class-validator";


export class ChatDto{

    @IsString()
    sender: string

    @IsString()
    receiver: string

    @IsString()
    content: string
}