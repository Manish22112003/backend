import express from "express"
import { getDetails } from "../controllers/getDetail.controller.js"
export const router = express.Router()

router.route('/getDetail').get(getDetails)

export default router