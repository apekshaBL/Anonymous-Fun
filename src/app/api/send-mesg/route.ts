import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import { Message } from "@/model/User.model";

export async function POST(request:Request){
    await dbConnect();
    const{username,content}=await request.json();
    try{
      const user=await UserModel.findOne({username});
      if(!user){
        return Response.json({
            success:false,
            message:"user not found"
        },{status:404})
      }
     if(!user.isAcceptingMessage){
        return Response.json({
            success:false,
            message:"user is not accepting mesages"
        },{status:403})
     }
     const newMsg={content,createdAt:new Date()}
     user.messages.push(newMsg as Message);
     await user.save();

     return Response.json({
        success:true,
        message:"message send successfully"
    },{status:401})
    }
    catch(error){
        console.log("error adding messages",error);
      return Response.json({
        success:false,
        message:"internal server error"
    },{status:500})
    }
}