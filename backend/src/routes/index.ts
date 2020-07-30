import express from "express"
import img from "./img/img"
import patient from "./Patient/Patient"
import rtw from "./Rtw/Rtw"
import test from "./test/test"

const router = express.Router()

router.use("/test", test)
router.use("/patient", patient)
router.use("/rtw", rtw)
router.use("/img", img)

export default router
