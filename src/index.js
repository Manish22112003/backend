import dotenv from "dotenv"

import connectDB from "./db/index.js";
import Razorpay from "razorpay"

connectDB();

dotenv.config({
    path : './Backend/env'
})

import app  from "./app.js";

export const instance = new Razorpay({
    key_id : process.env.KEY_ID,
    key_secret : process.env.KEY_SECRET
})
