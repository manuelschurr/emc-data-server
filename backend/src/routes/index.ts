import express from "express"
import patient from "./Patient/Patient"
import rtw from "./Rtw/Rtw"
import test from "./test/test"

const router = express.Router()

router.use("/test", test)
router.use("/patient", patient)
router.use("/rtw", rtw)

export default router
