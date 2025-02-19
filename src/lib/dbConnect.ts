import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

type ConnectionObject={
    isConnected?:number
}

const connection:ConnectionObject={}

async function dbConnect():Promise<void>{
    if(connection.isConnected){
        console.log("Already connected to database");
        return;
    }
    try{
       const db = await mongoose.connect(process.env.MONGODB_URL || "",{});
       connection.isConnected=db.connections[0].readyState

       console.log("Data base connected successfully");
    }catch(error){
        console.log("Data base connection failed",error);
        process.exit(1);
    }
}

export default dbConnect;
