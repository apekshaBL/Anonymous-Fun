import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import bcryptjs from "bcryptjs";
import { verify } from "crypto";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest){
    await dbConnect();
    try{
        const {username,email,password}=await req.json();
        const existingUserVerifiedByUsername = await UserModel.findOne({
            username,
            isVerified:true
        })
        if(existingUserVerifiedByUsername){
                return Response.json( {
                        success:false,
                        message:"Username is already taken"
                    },
                    {
                        status:400
                    }
                )
        }

        const existingUserVerifiedByemail=await UserModel.findOne({
            email
        })
        const verifyCode=Math.floor(10000+Math.random()*90000).toString();

        if(existingUserVerifiedByemail){
           if(existingUserVerifiedByemail.isVerified){
            return Response.json({
                success:false,
                message:"User already exist with this email"
            },{status:400})
           }
           else{
            const hashedpassword=await bcryptjs.hash(password,10)
            existingUserVerifiedByemail.password=hashedpassword;
            existingUserVerifiedByemail.verifyCode=verifyCode;
            existingUserVerifiedByemail.verifyCodeExpiry=new Date(Date.now()+3600000)
            await existingUserVerifiedByemail.save();
           }
        }
        else{
            const hashedpassword=await bcryptjs.hash(password,10)
            const expiryDate=new Date()
            expiryDate.setHours(expiryDate.getHours()+1)

            const newUser=new UserModel({
                username,
                email,
                password:hashedpassword,
                verifyCode,
                verifyCodeExpiry:expiryDate,
                isVerified:false,
                isAcceptMessage:true,
                messages:[]
            })
            await newUser.save()
        }
        const emailResponse=await sendVerificationEmail(
            email,
            username,
            verifyCode
        )
        if(!emailResponse.success){
            return Response.json(
                {
                    success:false,
                    message:emailResponse.message

                },{
                    status:500
                }
            )
        }

        return Response.json({
              success:true,
              message:"User registered successfully.Please verify your email"
        },{status:201});


    }
    catch(error){
        console.log("Error in registering the user",error);
        return Response.json({
            success:false,
            message:" Error registering user"
        },
        {status:500}
    )


    }
}

