import { instance } from "../index.js";
import crypto from "crypto";
import { Payment } from "../models/PaymentModel.js";

export const checkout = async (req, res) => {
  try {
    const amount = Number(req.body.amount);
    if (isNaN(amount)) {
      throw new Error("Invalid amount");
    }

    const options = {
      amount: amount * 100,
      currency: "INR",
    };
    const order = await instance.orders.create(options);

    console.log(order);

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Error during checkout:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

export const paymentVerification = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      // Database operation
      await Payment.create({
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      });

      res.redirect(
        `http://localhost:3000/paymentsuccess?reference=${razorpay_payment_id}`
      );
    } else {
      res.status(400).json({
        success: false,
      });
    }
  } catch (error) {
    console.error("Error during payment verification:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};
