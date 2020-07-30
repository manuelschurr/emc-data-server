import express from "express"
import getPatient from "./Patient/Patient"
import getRtw from "./Rtw/Rtw"
import test from "./test/test"

const router = express.Router()

router.use("/test", test)
router.use("/getPatient", getPatient)
router.use("/getRtw", getRtw)

export default router
