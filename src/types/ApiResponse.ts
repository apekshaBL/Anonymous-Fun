import { Message } from "@/app/model/User.model";
export interface ApiResponse{
    success:boolean;
    message:string;
    isAcceptingMessages?:boolean;
    messages?:Array<Message>
}