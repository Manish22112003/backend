import dotenv from "dotenv"
import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
dotenv.config({
    path : "./Backend/env"
})

const connectDB = async()=>{
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log("MONGO DB CONNECTED HURRAYYYY !!!! "+connectionInstance.connection.host);
    } catch (error) {
        console.log(`ERROR : MONGO DB Connection FAILED `,error);
    }
}

export default  connectDB