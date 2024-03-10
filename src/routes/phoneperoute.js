
// const {salt_key, merchant_id} = require('./secret');
import express from "express"
import { newPayment, statusCheck } from "../controllers/paymentphoneController.js";

export const router = express.Router()


router.route("/payment").post(newPayment)

router.route('/status').post(statusCheck);

