import dotenv from "dotenv";
import express from "express";
import { router as userRouter } from "./routes/user.route.js";
import { router as paymentRouter } from "./routes/paymentRoutes.js";
import { router as getDetails } from "./routes/getCertificate.js";
import {router as phonepeRoute} from './routes/phoneperoute.js'
import cors from "cors"
import morgan from "morgan";

const app = express();

dotenv.config({
  path: "./Backend/env",
});

app.use(morgan("tiny"))
app.use((req, res, next) => {
  res.setHeader('Permissions-Policy', 'payment=*');
  next();
});
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/v1", userRouter);

app.use("/api",getDetails)
// app.use("/api",paymentRouter)
app.use("/api/phonepe",phonepeRoute)

app.get("/", (req, res) => res.status(200).send("Welcome to the API"));

// app.get("/", (req, res) => res.redirect("/api/v1"));



app.get("/api/getkey", (req, res) =>
  res.status(200).json({ key: process.env.KEY_ID })
);

app.listen(process.env.PORT, () => {
  console.log(`Server is listening on ${process.env.PORT}`);
});

export default app;