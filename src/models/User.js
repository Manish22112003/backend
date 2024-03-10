import mongoose from "mongoose";


// Assuming you're using Node.js
const userSchema = new mongoose.Schema({
    "transaction_id" : {
        type : String,
        required : [true, "id not provided"]
    },
    "certificate_num" : {
        type : String,
        required:[true,"Certificate number is not provided"],
        unique : true
    },
    "name" : {
        type : String,
        required : [true,"Name is required"]
    },
    "email" : {
        type : String,
        required : [true, "Email not found"],
        unique: [true,"Email is already registered"]
    },
    "phone_number" : {
        type : Number,
        // unique : true,
        required : [true,"Number not found"]
    },
    "category" : {
        type : String,
        required : [true,"category not selected"]
    },
    "company_name" : {
        type : String,
        required : [true, "Company name is not provided"]
    },
    "gst_no" : {
        type : String,
        unique : false
    },
    "certi_issue_date" : {
        type : Date,
        default : Date.now
    },
    "expiry_date" : {
        type : Date,
        default : Date.now
    },
    "payment_status" : {
        type : String,
        enum : ['PENDING','SUCCESSFUL','FAILED'],
        default : "PENDING"
    }
    
},{timestamps : true})


export const User = mongoose.model("User",userSchema)