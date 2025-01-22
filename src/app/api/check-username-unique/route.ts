import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import {z} from "zod";
import { usernameValidation } from "@/Schemas/signUpSchema";
import { NextRequest } from "next/server";

const UsernameQuerySchema=z.object(
    {
        username:usernameValidation
    }
)

export async function GET(request:NextRequest){
    await dbConnect();
    if(request.method!=='GET'){
         return Response.json({
            success:false,
            message:"method not allowed pass get method"
         },{status:405})
    }
   
    try{
        const {searchParams}=new URL(request.url)
        const queryParam={
            username:searchParams.get('username')
        }

        const result=UsernameQuerySchema.safeParse(queryParam)
        console.log(result);
        if(!result.success){
           const usernameErrors=result.error.format().
           username?._errors || []
           return Response.json({
            success:false,
            message:usernameErrors?.length>0?usernameErrors.join(','):'Invalid query parameters',
           },{status:400})
        }
        const {username}=result.data
        const existingVerifiedUser = await UserModel.findOne({username,isVerified:true});
        if(existingVerifiedUser){
            return Response.json(
                {
                    success:false,
                    message:"Username is already taken"
                },{
                    status:400
                }
            )
          
        }
        return Response.json({
            success:true,
            message:"Username is unique"
        },{status:400})

    }
    catch(error){
        console.log("error checking username",error);
        return Response.json(
            {
                success:false,
                message:"error checking username"
            },
            {
                status:500
            }
        )
    }
}