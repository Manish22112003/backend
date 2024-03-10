import crypto from "crypto";
import axios from "axios";
import { User } from "../models/User.js";
import { error } from "console";
import {
  createNewUser,
  generateUniqueCertificateNumber,
} from "./user.controller.js";

function generateTransactionID() {
  const timestamp = Date.now();
  const randomNum = Math.floor(Math.random() * 1000000);
  const merchantPrefix = "T";
  const transactionID = `${merchantPrefix}${timestamp}${randomNum}`;
  return transactionID;
}

export const newPayment = async (req, res) => {
  console.log(req.body);
  try {
    const { name, phone_number, email, gst_no } = req.body;
    console.log(name, phone_number);
    // const merchantTransactionId = req.body.transactionId;
    const data = {
      merchantId: "PGTESTPAYUAT",
      merchantTransactionId: generateTransactionID(),
      merchantUserId: "MUID2QWQEFW5Q6WSER7",
      name: name,
      amount: 100 * 100,
      // name: req.body.name,
      // amount: req.body.amount * 100,
      redirectUrl: `http://localhost:3000/api/phonepe/status/`,
      redirectMode: "POST",
      mobileNumber: phone_number,
      paymentInstrument: {
        type: "PAY_PAGE",
      },
    };

    const payload = JSON.stringify(data);
    const payloadMain = Buffer.from(payload).toString("base64");
    const keyIndex = 1;
    const string =
      payloadMain + "/pg/v1/pay" + "099eb0cd-02cf-4e2a-8aca-3e6c6aff0399";
    const sha256 = crypto.createHash("sha256").update(string).digest("hex");
    const checksum = sha256 + "###" + keyIndex;

    const URL = "https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay";
    const options = {
      method: "POST",
      url: URL,
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        "X-VERIFY": checksum,
      },
      data: {
        request: payloadMain,
      },
    };

    axios
      .request(options)
      .then(async function (response) {
        console.log(response.data);

        // NOTE: here you can take txn id and store it coupled with the input data to mongo
        // on running status query, you have access to txnId again
        // if the status for that txn turns out to be success then change validity of record in mongo
        // next time on calling /payments check mongo for existing record of email and success ful payment status

        // fn for checking

        try {
          // const user_found = User.findOne({
          //   $or: [{ email }, { phone_number }, { gst_no }],
          // });
          const user_found = await User.findOne({ 
            $or :[
              {email},
              {phone_number},
              {gst_no}
            ]
           });

          if(user_found){
          if (user_found.payment_status === "SUCCESSFUL") {
            res.json({ exist: "Account Already Exist" });
          } else {
            const new_user = {
              ...req.body,
              transaction_id: response.data.data.merchantTransactionId,
            };

            createNewUser(new_user);
            return res.json(response.data.data.instrumentResponse.redirectInfo.url);
          }
        }else{
          const new_user = {
            ...req.body,
            transaction_id: response.data.data.merchantTransactionId,
          };

          createNewUser(new_user);
          return res.json(response.data.data.instrumentResponse.redirectInfo.url);
        }
        } catch (error) {
          console.log(error);
          res.status(500).json({ error: "Internal Server Error" });
        }
        
      })
      .catch(function (error) {
        console.error(error);
      });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      success: false,
    });
  }
};

export const statusCheck = async (req, res) => {
  const merchantTransactionId = res.req.body.transactionId;
  const merchantId = res.req.body.merchantId;

  const keyIndex = 1;
  const string =
    `/pg/v1/status/${merchantId}/${merchantTransactionId}` +
    "099eb0cd-02cf-4e2a-8aca-3e6c6aff0399";
  // const string = `https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/status/${merchantId}/${merchantTransactionId}`;
  const sha256 = crypto.createHash("sha256").update(string).digest("hex");
  const checksum = sha256 + "###" + keyIndex;

  const options = {
    method: "GET",
    url: `https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/status/${merchantId}/${merchantTransactionId}`,
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
      "X-VERIFY": checksum,
      "X-MERCHANT-ID": `${merchantId}`,
    },
  };

  // CHECK PAYMENT TATUS
  axios
    .request(options)
    .then(async (response) => {
      if (response.data.success === true) {
        const transaction_id = response.data.data.merchantTransactionId;
        const req_data = await User.findOne({ transaction_id });

        req_data.payment_status = "SUCCESSFUL";

        await req_data.save();

        const url = `http://localhost:5173/pay-success?transaction_id=${transaction_id}`;
        return res.redirect(url);
      } else {
        const url = `http://localhost:5173/contact?status=failed`;
        return res.redirect(url);
      }
    })
    .catch((error) => {
      const url = `http://localhost:5173/contact?status=failed`;
      return res.redirect(url);
      console.error(error);
    });
};
