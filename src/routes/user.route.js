import express from "express"
import { addUser } from "../controllers/user.controller.js"

export const router = express.Router()

router.route("/user").post(addUser)