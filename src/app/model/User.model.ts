import mongoose , {Schema,Document} from "mongoose";

export interface Message extends Document{
     content:String;
     createdAt:Date
}

const MessageSchema:Schema<Message>=new Schema({
    content:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        required:true,
        default:Date.now
    }

})

export interface User extends Document{
    username:String;
    email:String;
    password:String;
    verifyCode:String;
    isVerified:Boolean;
    verifyCodeExpiry:Date;
    isAcceptMessage:Boolean;
    messages:Message[]
}

const UserSchema:Schema<User>=new Schema({
    username:{
        type:String,
        required:[true,"Username is required"],
        trim:true,
        unique:true
    },
    email:{
        type:String,
        required:[true,"email is required"],
        unique:true,
        match:[/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/ ,"please use valid email address"]
    },
    password:{
        type:String,
        required:[true,"pasword is required"],
        trim:true
    },
    verifyCode:{
        type:String,
        required:[true,"enter verification code"],
        unique:true
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    verifyCodeExpiry:{
        type:Date,
        required:[true,"verification code Expiry is required"],
    },
    isAcceptMessage:{
        type:Boolean,
        default:true
    },
    messages:[MessageSchema]

})

const UserModel=(mongoose.models.User as mongoose.Model<User>)|| mongoose.model<User>("User",UserSchema);   

export default UserModel;