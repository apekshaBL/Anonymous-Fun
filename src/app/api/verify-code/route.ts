import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import { NextRequest,NextResponse } from "next/server";

export async function POST(request:NextRequest){
    dbConnect();
    try{
        const{username,code}=await request.json()
        const decodedUsername=decodeURIComponent(username)
        const user=await UserModel.findOne({username:decodedUsername})
        if(!user){
            return Response.json(
                {
                    success:false,
                    message:"User not found"
                },
                {
                    status:500
                }
            )
        }
        const isCodeValid=user.verifyCode === code
        const isCodeNotExpire=new Date(user.verifyCodeExpiry)>new Date()

        if(isCodeValid && isCodeNotExpire){
            user.isVerified=true
            await user.save()

            return Response.json(
                {
                    success:true,
                    message:"Account verified successfully"
                },
                {
                    status:200
                }
            )
        }else if(!isCodeNotExpire){
            return Response.json({
                success:false,
                message:"Verification code has expired,please sign up again to get a new code"
            },{status:400})
        }else{
            return Response.json({
                success:false,
                message:"Incorrect verification code"
            },{status:400})
        }

    }
    catch(error){
        console.log("Error verifying user",error);
       return Response.json({
        success:false,
        message:"Error verifying user"
       },{status:500})
    }
}
